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

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private  UserRepository userRepository;
    private  ModelMapper modelMapper;
    private  PasswordEncoder passwordEncoder;
    private SecurityUtils securityUtils;
    private FileStorageService fileStorageService;

    @Autowired
    public UserService(UserRepository userRepository, ModelMapper modelMapper, PasswordEncoder passwordEncoder, SecurityUtils securityUtils, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
        this.securityUtils = securityUtils;
        this.fileStorageService = fileStorageService;
    }

    public UserResponse createUser(UserRequest request) throws ResourceNotFoundException {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserException.ResourceAlreadyExistsException("Email already registered");
        }

        User user = modelMapper.map(request, User.class);
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setRole(Role.USER);

        User savedUser = userDPProcess(request,user);
        return modelMapper.map(savedUser, UserResponse.class);
    }


    public UserResponse getUserById(String id) throws ResourceNotFoundException {
        User user = findUserById(id);
        return modelMapper.map(user, UserResponse.class);
    }

    public UserResponse getUser() throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        return modelMapper.map(user, UserResponse.class);
    }

    public void deleteUser() throws ResourceNotFoundException {
        String id = securityUtils.getCurrentUser().getId();
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    public boolean existUserByEmail(String email){
        return userRepository.existsByEmail(email);
    }

    public UserResponse updateUser(UserRequest request) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        if (request.getNewPassword() != null) {
             if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new UserException.InvalidPasswordException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }
        return updateUserProcess(user,request);
    }

    public UserResponse updateUserById(String id, UserRequest request) throws ResourceNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if(securityUtils.getCurrentUser().getRole().equals(Role.ADMIN)){
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }
        return updateUserProcess(user,request);
    }

    public Page<UserResponse> getAllUsers(Pageable pageable , String searchTerm) {
        Page<User> users = userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(searchTerm,searchTerm,searchTerm, pageable);
        return users.map(user -> modelMapper.map(user, UserResponse.class));
    }

    public void deleteUserById(String id) throws ResourceNotFoundException {

        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        else if (Role.ADMIN.equals(getUserById(id).getRole()))
        {
            throw new RuntimeException("Cannot Delete Admin");
        }
        userRepository.deleteById(id);
    }

    public User getUserByEmail(String email) throws ResourceNotFoundException {
        if (!userRepository.existsByEmail(email)) {
            throw new ResourceNotFoundException("User not found");
        }
        return userRepository.findByEmail(email).orElse(null);
    }

    private User findUserById(String id) throws ResourceNotFoundException {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserResponse updateUserProcess(User user , UserRequest request) throws ResourceNotFoundException {

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

    private User userDPProcess(UserRequest request, User user) throws ResourceNotFoundException {
        if (request.getUserPDFile() != null && !request.getUserPDFile().isEmpty()) {
            String prefix = "user_DP_" + user.getId();
            String fileName;
            try {
                fileName = fileStorageService.storeFile(request.getUserPDFile(), prefix, FileEnums.ImageType.USER_DP);
                user.setUserDPUrl("/api/v1/files/" + fileName);
            } catch (FileStorageException e) {
                throw new RuntimeException(e);
            }
        } else if (request.getExistingDPUrl() != null && !request.getExistingDPUrl().isEmpty()) {
            user.setUserDPUrl(request.getExistingDPUrl());
        } else {
            user.setUserDPUrl("");
        }

        return userRepository.save(user);
    }
}