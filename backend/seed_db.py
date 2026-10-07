import sys
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import models
import auth

# Create tables
models.Base.metadata.create_all(bind=engine)

def seed_users():
    db = SessionLocal()
    demo_users = [
        {
            "name": "Tanvir Ahmed",
            "email": "tanvir971hasan@gmail.com",
            "role": "customer",
            "password": "customer_pin"
        },
        {
            "name": "Md. Shahidul Islam",
            "email": "shahid.telecom@upayagent.bd",
            "role": "agent",
            "password": "agent_pin"
        },
        {
            "name": "Dr. Rafiqur Rahman",
            "email": "rahman.pharmacy@upaymerchant.bd",
            "role": "merchant",
            "password": "merchant_pin"
        },
        {
            "name": "Anwar Hossain",
            "email": "anwar.hossain@upay.com.bd",
            "role": "operator",
            "password": "operator_pin"
        }
    ]
    
    for user_data in demo_users:
        user = db.query(models.User).filter(models.User.email == user_data["email"]).first()
        if not user:
            hashed_password = auth.get_password_hash(user_data["password"])
            new_user = models.User(
                name=user_data["name"],
                email=user_data["email"],
                role=user_data["role"],
                password_hash=hashed_password
            )
            db.add(new_user)
            print(f"Created user: {user_data['email']}")
    
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_users()
    print("Database seeding completed.")
