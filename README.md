# Simula-Web

Este repositório se refere a parte do back-end do projeto geral, Simula Web.

# O que é este projeto?

Você pode verificar o objetivo do projeto na [página do front-end do projeto](https://github.com/Guilherm456/simula-web 'Simula-Web')

## Por que não usar o sistema de API do NextJS (front-end)

O próprio NextJS conta com uma tecnologia de API, então por que não foi utilizado essa ferramenta, em vez de separar em duas partes? Porque o Simula Web necessita de um servidor rodando o maior tempo possível, onde vai ao contrário do jeito que o NextJS funciona com as API, sendo um sistema severless (ativa o servidor apenas quando o usuário solicita).
Existem alguns meios para deixar executando o tempo todo no NextJS, mas torna inviável e tornaria todo o processo de criação mais complexo do que o necessário.

## Tecnologias usadas

- NestJS
- Typescript
- MongoDB
