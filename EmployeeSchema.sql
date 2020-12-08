DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;


CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(40)NOT NULL, -- to hold department name
    PRIMARY KEY(id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  salary  INT(10) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY key (id),
  FOREIGN KEY (department_id) REFERENCES  department (id)
);

CREATE TABLE employee (
   id  INT NOT NULL AUTO_INCREMENT,
   first_name  VARCHAR(40) NOT NULL,
   last_name  VARCHAR(40) NOT NULL,
   role_id  INT NOT NULL,
   manager_id  INT,
   PRIMARY KEY (id),
   FOREIGN KEY (role_id) REFERENCES  role (id),
   FOREIGN KEY (manager_id) REFERENCES  employee (id)
);

INSERT INTO department (department_name)
VALUES ("Accounting"), ("Sales"), ("Engineering"), ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("CFO", 150000, 1), ("Sales Manager", 90000, 2), ("Chief Engineer", 150000, 3), ("Sales Manager", 100000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sam", "Rodriguez", 1, null), ("Tony", "Stark", 2, null), ("Betty", "Rubel", 3, 1), ("The", "Dude", 2, 1), ("Space", "Ghost", 3, 1), ("Bob", "Barker", 4, 1);
