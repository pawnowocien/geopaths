## Set up

- **Tested on python-3.13.3**

- **Install dependencies:**

  ```
  pip install "Django==5.2", django-tailwind[reload]
  ```

- To run **tailwind**:
  
  Besides running `python manage.py runserver`, also run

  ```bash
  python manage.py tailwind start
  ```

  in the same directory, concurrently.