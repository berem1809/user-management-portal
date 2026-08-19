from pydantic import BaseModel, ConfigDict


class Paginated(BaseModel):
    limit: int
    offset: int
    total: int

    model_config = ConfigDict(from_attributes=True)
