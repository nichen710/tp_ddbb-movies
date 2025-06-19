from database.db import Base
from sqlalchemy import  Column, event
from sqlalchemy.sql.sqltypes import Integer, String
import csv

class Movie(Base):
    __tablename__ = "movies"
    """Data model for a movie"""
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    

# Event to load data from CSV file after creating the table
@event.listens_for(Movie.__table__, 'after_create')
def receive_after_create(target, connection, **kw):
    load_path = "database/load_movie.csv"
    with open(load_path, 'r', encoding="utf-8") as file:
        csv_reader = csv.reader(file, delimiter=',')
        data = []

        for row in csv_reader:
            data.append({
                'id': row[0],
                'title': row[1]
            })

        connection.execute(target.insert(), data)
    return