from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

# este é o objeto de configuração do Alembic, que fornece
# acesso aos valores dentro do arquivo .ini em uso.
config = context.config

# Interpreta o arquivo de configuração para log do Python.
# Esta linha configura os loggers basicamente.
fileConfig(config.config_file_name)

# adicione o objeto MetaData do seu modelo aqui
# para suporte a 'autogenerate'
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
# target_metadata = None

from app.models import SQLModel  # noqa
from app.core.config import settings # noqa

target_metadata = SQLModel.metadata

# outros valores da configuração, definidos pelas necessidades do env.py,
# podem ser adquiridos:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def get_url():
    return str(settings.SQLALCHEMY_DATABASE_URI)


def run_migrations_offline():
    """Executa migrações no modo 'offline'.

    Isso configura o contexto apenas com uma URL
    e não com uma Engine, embora uma Engine seja aceitável
    aqui também. Ao pular a criação da Engine
    nós nem precisamos de uma DBAPI disponível.

    Chamadas para context.execute() aqui emitem a string dada para a
    saída do script.

    """
    url = get_url()
    context.configure(
        url=url, target_metadata=target_metadata,
        literal_binds=True, compare_type=True
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Executa migrações no modo 'online'.

    Neste cenário, precisamos criar uma Engine
    e associar uma conexão com o contexto.

    """
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = get_url()
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata,
            compare_type=True
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
