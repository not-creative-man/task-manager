CREATE TABLE IF NOT EXISTS users (
    id int primary key AUTO_INCREMENT,
    nickname varchar(255) not null,
    password varchar(255) not null,
    email varchar(255) unique not null,
    active timestamp,
    token varchar(255) unique
);

CREATE TABLE IF NOT EXISTS tasks (
    task_id int primary key AUTO_INCREMENT,
    user_id int not null,
    task_body varchar(255) not null,
    is_task_done bool not null,
    task_deadline datetime,
    foreign key (user_id) references users (id)
);