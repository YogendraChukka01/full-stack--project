package com.surplusfood.platform.service;

import com.surplusfood.platform.model.NotificationEntity;
import com.surplusfood.platform.model.User;
import com.surplusfood.platform.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final UserRepository userRepository;

    public NotificationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void notifyUser(Long userId, String type, String payload) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        NotificationEntity notification = new NotificationEntity();
        notification.setUser(user);
        notification.setType(type);
        notification.setPayload(payload);
        notification.setIsRead(false);
    }

    public List<String> getMockNotifications() {
        return List.of("Donation created", "Claim accepted", "Pickup scheduled");
    }
}
