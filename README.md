# Aquarium

At Aquarium School we are specialized in offering regular and personalized swimming courses for boys and girls, as well as hydrotherapy for all ages. With our extensive experience, we guarantee optimal development in each of our programs.

Back-End: **Django**  
Front-End: **React JS**

# Setup

1. Download and Install Python 3.8.5 (https://www.python.org/)

2. Create a virtual enviroment.

   - Install Virtual Env:  
      Python3: `pip3 install virtualenv`  
      Python2: `pip install virtualenv`

   - _Windows_:
     - Create Virtual Env: `python -m venv myVirtualEnvName`
     - Activate Virtual Env: `myVirtualEnvName\Scripts\activate` (**_activate.bat_** if it doesn't work)
     - _Remember_ that to deactivate Virtual Env _later_ just type: `deactivate` (**_deactivate.bat_** if it doesn't work)
   - _Linux_:
     - Create Virtual Env: `virtualenv myVirtualEnvName`
     - Activate Virtual Env: `source myprojectenv/bin/activate`
     - _Remember_ that to deactivate Virtual Env _later_ just type: `deactivate`

3. Clone this project: `git clone https://github.com/TheLittleMister/aquarium.git`

4. Install dependencies:

   - Inside the project folder (Project root): `pip install -r requirements.txt`

5. Set project DEBUG mode:

   - Open up /aquarium/aquarium/settings.py:

     - Change Line 21 with: `DEBUG = True`

   - Open up /aquarium/users/utils.py:
     - If you are using other backend port change line 5 with: `mysite = "http://127.0.0.1:<your backend port>" if settings.DEBUG else "https://aquariumschool.co"`

6. Install front-end dependencies and start react project:

   - Go to /aquarium/front-end:
     - Run: `npm install` to install dependencies
     - Run: `npm start` to start the project in `http://127.0.0.1:3000/`
   - Open up /aquarium/front-end/src/utils/utils.tsx:
     - Change Line 6 with: `export const url = "http://127.0.0.1:<your backend port>";`

7. Migrations and Run server:

   - Inside the project folder (Project root):
     - 1. Make Database migrations: `python manage.py makemigrations users`
     - 2. Migrate: `python manage.py migrate`
     - 3. Run server: `python manage.py runserver`
     - 4. If you want to change server port: `python manage.py runserver <your backend port>` _e.g_ `python manage.py runserver 8080`

8. To see the changes made before pull request:

   - Run `npm run build` in /aquarium/front-end and go to your browser and open: `http://127.0.0.1:8000/` or `http://127.0.0.1:<your backend port>/`

# Project contributors

Remember to keep our requirements.txt and package.json files up to date and clean if you contribute to the project:

- Inside the project folder (Project root): `pip freeze > requirements.txt`

Before making a pull request:

- Open up /aquarium/aquarium/settings.py:

  - Change Line 21 with: `DEBUG = False`

- Open up /aquarium/front-end/src/utils/utils.tsx:

  - Change Line 6 with: `export const url = "https://aquariumschool.co";`
