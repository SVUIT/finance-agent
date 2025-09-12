USE test;

-- Total spending in March 2024
SELECT SUM(amount) AS total_spending
FROM transaction_info
WHERE transaction_type = 'Outgoing'
  AND YEAR(created_at) = 2024
  AND MONTH(created_at) = 3;

-- Total income in May 2024
SELECT SUM(amount) AS total_income
FROM transaction_info
WHERE transaction_type = 'Incoming'
  AND YEAR(created_at) = 2024
  AND MONTH(created_at) = 5;

-- Average daily spending in April 2024
SELECT AVG(daily_spend) AS avg_daily_spending
FROM (
    SELECT DATE(created_at) AS day, SUM(amount) AS daily_spend
    FROM transaction_info
    WHERE transaction_type = 'Outgoing'
      AND YEAR(created_at) = 2024
      AND MONTH(created_at) = 4
    GROUP BY DATE(created_at)
) ;

-- Top spending category in April 2024
SELECT category, SUM(amount) AS total_spent
FROM transaction_info
WHERE transaction_type = 'Outgoing'
  AND YEAR(created_at) = 2024
  AND MONTH(created_at) = 4
GROUP BY category
ORDER BY total_spent DESC
LIMIT 1;
