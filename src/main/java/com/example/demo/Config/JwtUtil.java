/*
 * package com.example.demo.Config;
 * 
 * import java.util.List;
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.security.authentication.
 * UsernamePasswordAuthenticationToken; import
 * org.springframework.security.core.authority.SimpleGrantedAuthority; import
 * org.springframework.security.core.context.SecurityContextHolder; import
 * org.springframework.stereotype.Component; import
 * org.springframework.web.filter.OncePerRequestFilter;
 * 
 * import com.example.demo.Model.Userss; import
 * com.example.demo.Repository.UserssRepo;
 * 
 * import io.jsonwebtoken.io.IOException; import jakarta.servlet.FilterChain;
 * import jakarta.servlet.ServletException; import
 * jakarta.servlet.http.HttpServletRequest; import
 * jakarta.servlet.http.HttpServletResponse; import
 * lombok.RequiredArgsConstructor;
 * 
 * @Component
 * 
 * @RequiredArgsConstructor public class JwtUtil extends OncePerRequestFilter {
 * 
 * // @Autowired // JwtUtil jwtUtil;
 * 
 * @Autowired UserssRepo userRepository;
 * 
 * @Override protected void doFilterInternal(HttpServletRequest request,
 * HttpServletResponse response, FilterChain chain) throws ServletException,
 * IOException, java.io.IOException {
 * 
 * String header = request.getHeader("Authorization"); if (header != null &&
 * header.startsWith("Bearer ")) { String token = header.substring(7); String
 * username = JwtUtil.extractUsername(token);
 * 
 * Userss user = userRepository.findByUsername(username).orElse(null); if (user
 * != null) { UsernamePasswordAuthenticationToken auth = new
 * UsernamePasswordAuthenticationToken(user.getUsername(), null, List.of(new
 * SimpleGrantedAuthority("ROLE_" + user.getRole().getName())));
 * SecurityContextHolder.getContext().setAuthentication(auth); } }
 * chain.doFilter(request, response); }
 * 
 * static String extractUsername(String token) { // TODO Auto-generated method
 * stub return null; }
 * 
 * protected void doFilterInternal1(HttpServletRequest request,
 * HttpServletResponse response, FilterChain filterChain) throws
 * ServletException, java.io.IOException { // TODO Auto-generated method stub
 * 
 * }
 * 
 * public String generateToken(Userss user) { // TODO Auto-generated method stub
 * return null; } }
 */