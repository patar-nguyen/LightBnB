INSERT INTO users (name, email, password)
VALUES ('Clark Kent', 'clark.kent@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Bruce Wayne', 'bruce.wayne@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Barry Allen', 'barry.allen@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url. cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Daily Planet', 'description', 'url', 'url', 100, 2, 2, 3, 'Canada', 'DP Street', 'Toronto', 'Ontario', 'D1P 1S1', TRUE),
(2, 'Batcave', 'description', 'url', 'url', 125, 3, 3, 4, 'Canada', 'BC Street', 'Mississauga', 'Ontario', 'B1C 1B1', TRUE),
(3, 'Star Labs', 'description', 'url', 'url', 150, 4, 4, 4, 'Canada', 'SL', 'Brampton', 'Ontario', 'S1L 1F1', FALSE);

INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 10, 'message'),
(2, 2, 2, 9, 'message'),
(3, 3, 3, 8, 'message');