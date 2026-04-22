//package com.example.demo.Service;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.*;
//import org.springframework.stereotype.Service;
//
//import com.example.demo.Model.User;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//public class UserService implements UserDetailsService  {
//
//	@Autowired
//    private  UserssRepo userRepository;
//
//	 @Override
//	    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//
//	        User user = userRepository.findByUsername(username)
//	                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//	        return org.springframework.security.core.userdetails.User.builder()
//	                .username(user.getUsername())
//	                .password(user.getPassword())
//	                .roles(user.getRole().getName()) // ✅ FIXED
//	                .build();
//	    }
//	 
//	 
//	 public User getUserByUsername(String username) {
//	        return userRepository.findByUsername(username)
//	                .orElseThrow(() -> new RuntimeException("User not found"));
//	    }
//
//	    public List<User> getAllUsers() {
//	        return userRepository.findAll();
//	    }
//}