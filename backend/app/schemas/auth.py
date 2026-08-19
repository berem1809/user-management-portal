from pydantic import BaseModel, ConfigDict, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class LoginResponse(BaseModel):
    pending_token: str
    token_type: str = "bearer"
    expires_in: int


class VerifyOtpRequest(BaseModel):
    otp: str = Field(min_length=6, max_length=6)


class VerifyOtpResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

    model_config = ConfigDict(from_attributes=True)
