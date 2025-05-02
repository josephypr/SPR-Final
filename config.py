import os
import cloudinary
import cloudinary.uploader
import cloudinary.api


class Config:
    USER_DB = 'root'
    PASS_DB = ''
    URL_DB = 'localhost'
    NAME_DB = 'spr2'
    FULL_URL_DB= F'mysql+pymysql://{USER_DB}:{PASS_DB}@{URL_DB}/{NAME_DB}'
    SQLALCHEMY_DATABASE_URI = FULL_URL_DB
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'clave_secreta'
    PROPAGATE_EXCEPTIONS = True

cloudinary.config(
    cloud_name = 'dymxlvysw',
    api_key= '217884591166536',
    api_secret = 'pwLOwLLBJ7mDyR2ONmiM7RqCZgU',
    secure = True
)

config = {
    'default': Config
}