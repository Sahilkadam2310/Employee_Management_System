/*
 * package com.example.demo.Config;
 * 
 * import java.io.IOException; import java.util.ArrayList; import
 * java.util.List;
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.security.authentication.
 * UsernamePasswordAuthenticationToken; import
 * org.springframework.security.core.context.SecurityContextHolder; import
 * org.springframework.security.core.authority.SimpleGrantedAuthority; import
 * org.springframework.stereotype.Component; import
 * org.springframework.web.filter.OncePerRequestFilter;
 * 
 * import com.example.demo.Model.Userss; import
 * com.example.demo.Repository.UserssRepo;
 * 
 * import jakarta.servlet.FilterChain; import jakarta.servlet.ServletException;
 * import jakarta.servlet.http.HttpServletRequest; import
 * jakarta.servlet.http.HttpServletResponse;
 * 
 * import lombok.RequiredArgsConstructor;
 * 
 * @Component
 * 
 * @RequiredArgsConstructor public class JwtFilter extends OncePerRequestFilter
 * {
 * 
 * @Autowired JwtUtil jwtUtil;
 * 
 * @Autowired UserssRepo userRepository;
 * 
 * @Override protected void doFilterInternal(HttpServletRequest request,
 * HttpServletResponse response, FilterChain chain) throws ServletException,
 * IOException {
 * 
 * String header = request.getHeader("Authorization");
 * 
 * // 🔐 Check token present if (header != null && header.startsWith("Bearer "))
 * {
 * 
 * String token = header.substring(7);
 * 
 * try { String username = jwtUtil.extractUsername(token);
 * 
 * if (username != null &&
 * SecurityContextHolder.getContext().getAuthentication() == null) {
 * 
 * Userss user = userRepository.findByUsername(username).orElse(null);
 * 
 * if (user != null) {
 * 
 * // ✅ Safe authority creation (NO singletonList / NO List.of)
 * List<SimpleGrantedAuthority> authorities = new ArrayList<>();
 * authorities.add( new SimpleGrantedAuthority("ROLE_" +
 * user.getRole().getName()) );
 * 
 * UsernamePasswordAuthenticationToken auth = new
 * UsernamePasswordAuthenticationToken( user.getUsername(), null, authorities );
 * 
 * SecurityContextHolder.getContext().setAuthentication(auth); } } } catch
 * (Exception e) { // ❌ invalid token → ignore (no crash)
 * System.out.println("JWT Error: " + e.getMessage()); } }
 * 
 * chain.doFilter(request, response); } }
 */