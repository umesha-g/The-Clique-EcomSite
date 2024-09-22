package com.umesha_g.store_backend.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.umesha_g.store_backend.model.User;
import com.umesha_g.store_backend.repository.UserRepository;
import com.umesha_g.store_backend.util.IdGen;
import com.umesha_g.store_backend.util.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
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
        Optional<User> optionalUser = userRepository.findByEmail(email);
        return optionalUser.orElse(null);
    }

    public User findById(String id) {
        Optional<User> optionalUser = userRepository.findById(id);
        return optionalUser.orElse(null);
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
            result.put("success", true);
            result.put("token", token);
        } else {
            result.put("success", false);
        }

        return result;
    }

    public User register(User user) {
        user.setId(idGen.generateId(8, "User"));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        return save(user);
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
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(false);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }

    public String getTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("token")) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public void clearTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(false);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}