package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.UserRequest;
import com.umesha_g.the_clique_backend.dto.response.UserResponse;
import com.umesha_g.the_clique_backend.exception.FileStorageException;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.exception.UserException;
import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.model.enums.FileEnums;
import com.umesha_g.the_clique_backend.model.enums.Role;
import com.umesha_g.the_clique_backend.repository.UserRepository;
import com.umesha_g.the_clique_backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private  UserRepository userRepository;
    private  ModelMapper modelMapper;
    private  PasswordEncoder passwordEncoder;
    private FileStorageService fileStorageService;
    private SecurityUtils securityUtils;
    private PlatformStatisticsService platformStatisticsService;

    @Autowired
    public UserService(UserRepository userRepository, ModelMapper modelMapper, PasswordEncoder passwordEncoder, FileStorageService fileStorageService, SecurityUtils securityUtils, PlatformStatisticsService platformStatisticsService) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageService = fileStorageService;
        this.securityUtils = securityUtils;
        this.platformStatisticsService = platformStatisticsService;
    }

    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserException.ResourceAlreadyExistsException("Email already registered");
        }

        User user = modelMapper.map(request, User.class);
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setRole(Role.USER);

        User savedUser = userDPProcess(request,user);
        List<User> users = userRepository.findAll();
        platformStatisticsService.updateActiveUsers(users.size());
        platformStatisticsService.incrementNewRegistrations();

        return modelMapper.map(savedUser, UserResponse.class);
    }

    public UserResponse getUser() throws ResourceNotFoundException {
        User currentUser = securityUtils.getCurrentUser();
        return modelMapper.map(currentUser, UserResponse.class);
    }

    public void deleteUser() throws ResourceNotFoundException {
        User currentUser = securityUtils.getCurrentUser();
        if (!userRepository.existsById(currentUser.getId())) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(currentUser.getId());
    }

    public User getUserByEmail(String email) throws ResourceNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public boolean existUserByEmail(String email){
        return userRepository.existsByEmail(email);
    }

    public UserResponse updateUser(UserRequest request) throws ResourceNotFoundException, FileStorageException {
        User currentUser = securityUtils.getCurrentUser();
        if (request.getNewPassword() != null) {
             if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
                throw new UserException.InvalidPasswordException("Current password is incorrect");
            }
             currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }
        if (!currentUser.getUserDPUrl().isEmpty() && request.getUserDPFile() !=null && !currentUser.getUserDPUrl().substring(14).equals("default-dp.jpg")){
            fileStorageService.deleteFile(currentUser.getUserDPUrl().substring(14));
        }
        return updateUserProcess(currentUser,request);
    }

    public Page<UserResponse> getAllUsers(Pageable pageable , String searchTerm) {
        Page<User> users = userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(searchTerm,searchTerm,searchTerm, pageable);
        return users.map(user -> modelMapper.map(user, UserResponse.class));
    }

    public UserResponse getUserById(String id) throws ResourceNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return modelMapper.map(user, UserResponse.class);
    }

    public UserResponse updateUserById(String id, UserRequest request) throws ResourceNotFoundException, FileStorageException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        if (!user.getUserDPUrl().isEmpty() && request.getUserDPFile() !=null && !user.getUserDPUrl().substring(14).equals("default-dp.jpg")){
            fileStorageService.deleteFile(user.getUserDPUrl().substring(14));
        }
        return updateUserProcess(user,request);
    }

    public void deleteUserById(String id) throws ResourceNotFoundException, FileStorageException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (Role.ADMIN.equals(user.getRole())) {
            throw new RuntimeException("Cannot Delete Admin");
        }

        if (!user.getUserDPUrl().isEmpty()){
            String fileName = user.getUserDPUrl().substring(14);
            if (!fileName.equals("default-dp.jpg")) {
                fileStorageService.deleteFile(Objects.requireNonNull(fileName));
            }
        }
        userRepository.deleteById(id);
    }

    private UserResponse updateUserProcess(User user , UserRequest request) {

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new UserException.ResourceAlreadyExistsException("A User already exists with this E-mail");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }

        User updatedUser = userDPProcess(request,user);
        return modelMapper.map(updatedUser, UserResponse.class);

    }

    private User userDPProcess(UserRequest request, User user) {
        if (request.getUserDPFile() != null && !request.getUserDPFile().isEmpty()) {
            String prefix = "user_DP_" + user.getId();
            String fileName;
            try {
                fileName = fileStorageService.storeFile(request.getUserDPFile(), prefix, FileEnums.ImageType.USER_DP);
                user.setUserDPUrl("/api/v1/files/" + fileName);
            } catch (FileStorageException e) {
                throw new RuntimeException(e);
            }
        } else if (request.getExistingDPUrl() != null && !request.getExistingDPUrl().isEmpty()) {
            user.setUserDPUrl(request.getExistingDPUrl());
        } else {
            user.setUserDPUrl("/api/v1/files/default-dp.jpg");
        }

        return userRepository.save(user);
    }
}