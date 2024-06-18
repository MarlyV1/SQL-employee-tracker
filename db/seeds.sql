INSERT INTO department (name)
VALUES ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales');

INSERT INTO role (role, salary, department_id)
VALUES ('Sales Lead', 100000, 4),
       ('Salesperson',80000, 4),
       ('Lead Engineer', 150000, 1),
       ('Software Engineer', 120000, 1),
       ('Account Manager', 160000, 2),
       ('Accountant', 125000, 2),
       ('Legal Team Lead', 250000, 3),
       ('Lawyer', 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, null),
       ('Jane', 'Smith', 2, 1),
       ('Thalia', 'Brown', 3, null),
       ('Tom', 'Allen', 4, 3),
       ('Michelle', 'Johnson', 5, null),
       ('Paul', 'Parker', 6, 5),
       ('Alex', 'Woods', 7, null),
       ('Horacio', 'Cane', 8, 7);