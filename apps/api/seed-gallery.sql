INSERT OR REPLACE INTO custom_orders (
  id, customer_name, customer_email, occasion, budget, shape, notes, reference_image_urls, status
) VALUES 
('co_demo1', 'Alice', 'alice@example.com', 'Wedding', '$100+', 'Almond', 'Bridal lace and pearls theme', '["/images/custom/bridal-lace.png"]', 'shipped'),
('co_demo2', 'Bob', 'bob@example.com', 'Birthday', '$50-$100', 'Stiletto', 'Neon green with flame accents', '["/images/custom/neon-flames.png"]', 'shipped'),
('co_demo3', 'Chloe', 'chloe@example.com', 'Everyday', '$50-$100', 'Square', 'Minimalist dot art on nude base', '["/images/custom/minimalist-dots.png"]', 'shipped'),
('co_demo4', 'Diana', 'diana@example.com', 'Prom', '$100+', 'Coffin', 'Chrome silver with 3D gems', '["/images/custom/chrome-gems.png"]', 'shipped');
