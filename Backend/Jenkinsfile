pipeline {
    agent any

    environment {
        VENV = 'venv'
    }

    stages {

        stage('Clone') {
            steps {
                git 'https://github.com/rahulkumarparida/MeeshoClone.git'
            }
        }

        stage('Setup Python') {
            steps {
                sh 'python -m venv $VENV'
                sh '. $VENV/bin/activate && pip install -r requirements.txt'
            }
        }

        stage('Lint Check') {
            steps {
                sh '. $VENV/bin/activate && flake8 . || true'
            }
        }

        stage('Run Tests') {
            steps {
                sh '. $VENV/bin/activate && python manage.py test'
            }
        }
    }
}