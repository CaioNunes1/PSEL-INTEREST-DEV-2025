from sqlmodel import Session, create_engine
from sqlmodel import SQLModel

from app.core.config import settings

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# certifique-se de que todos os modelos SQLModel sejam importados (app.models)
# antes de inicializar o DB caso contrário, o SQLModel pode falhar ao
# inicializar os relacionamentos corretamente para mais detalhes:
# https://github.com/fastapi/full-stack-fastapi-template/issues/28


def init_db(session: Session) -> None:
    SQLModel.metadata.create_all(engine)
