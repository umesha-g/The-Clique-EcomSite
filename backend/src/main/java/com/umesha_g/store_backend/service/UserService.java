package com.umesha_g.store_backend.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.umesha_g.store_backend.model.User;
import com.umesha_g.store_backend.repository.UserRepository;
import com.umesha_g.store_backend.util.IdGen;
import com.umesha_g.store_backend.util.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private IdGen idGen;

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Map<String, Object> login(String email, String password) {
        Map<String, Object> result = new HashMap<>();
        User user = findByEmail(email);

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            String token = jwtUtil.generateToken(email);
            result.put("isSuccess", true);
            result.put("userAuthToken", token);
        } else {
            result.put("isSuccess", false);
        }

        return result;
    }

    public User register(String Email, String Password, String Fullname) {
        User newUser = new User();

        newUser.setEmail(Email);
        newUser.setFullName(Fullname);
        newUser.setId(idGen.generateId(8, "User"));
        newUser.setPassword(passwordEncoder.encode(Password));
        newUser.setCreatedAt(LocalDateTime.now());
        return save(newUser);

    }

    public Map<String, String> getUserProfile(String email) {
        User user = findByEmail(email);
        Map<String, String> profile = new HashMap<>();

        if (user != null) {
            profile.put("email", user.getEmail());
            profile.put("fullName", user.getFullName());
        }

        return profile;
    }

    public boolean updateUserProfile(String email, String fullName) {
        User user = findByEmail(email);

        if (user != null) {
            user.setFullName(fullName);
            save(user);
            return true;
        }

        return false;
    }

    public void setTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("userAuthToken", token);
        cookie.setHttpOnly(false);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }

    public void clearTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("userAuthToken", null);
        cookie.setHttpOnly(false);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}