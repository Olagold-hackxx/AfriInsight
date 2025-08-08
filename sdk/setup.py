from setuptools import setup, find_packages

setup(
    name="dehug",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "requests",
        "pandas"
    ],
    author="DeHug",
    description="Decentralized Hugging Face loader for IPFS/Filecoin datasets",
    url="https://github.com/olagold-hackxx/dehug/sdk/python-sdk",
)
