//package com.example.demo.Model;
//
//import java.util.Set;
//
//import jakarta.persistence.CascadeType;
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import jakarta.persistence.FetchType;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.OneToMany;
//import jakarta.persistence.Table;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//
//@Entity
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//@Table(name = "roles")
//public class Role {
//
//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	private Long id;
//
//	@Column(unique=true)
//	private String name;
//	
//	private String description;
//	
//	@OneToMany(mappedBy = "role",cascade=CascadeType.ALL,fetch=FetchType.LAZY)
//	private Set<User> userss;
//
//
//	public Long getId() {
//		return id;
//	}
//
//	public void setId(Long id) {
//		this.id = id;
//	}
//
//	public String getDescription() {
//		return description;
//	}
//
//	public void setDescription(String description) {
//		this.description = description;
//	}
//
//	public Set<User> getUserss() {
//		return userss;
//	}
//
//	public void setUserss(Set<User> userss) {
//		this.userss = userss;
//	}
//
//	public void setName(String name) {
//		this.name = name;
//	}
//	
//	   public String getName() {
//	        return name;
//	    }
//
//	@Override
//	public String toString() {
//		return "Role [id=" + id + ", name=" + name + ", description=" + description + ", userss=" + userss + "]";
//	}
//	
//	
//
//}
