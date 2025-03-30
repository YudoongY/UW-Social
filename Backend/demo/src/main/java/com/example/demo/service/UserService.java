package com.example.demo.service;
import com.example.demo.repository.UserRepository;
import com.example.demo.model.User;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User saveOrUpdateUser(User user) {
        // 检查用户是否存在，存在则更新数据，否则新建
        Optional<User> existingUser = userRepository.findByUid(user.getUid());
        if(existingUser.isPresent()){
            User u = existingUser.get();
            u.setDisplayName(user.getDisplayName());
            u.setEmail(user.getEmail());
            u.setPhotoURL(user.getPhotoURL());
            u.setLastLogin(user.getLastLogin());
            return userRepository.save(u);
        } else {
            return userRepository.save(user);
        }
    }
}



