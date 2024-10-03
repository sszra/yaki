FROM mcr.microsoft.com/devcontainers/base:ubuntu

ENV DENO_INSTALL=/home/vscode/.deno
RUN mkdir -p ${DENO_INSTALL} \
  && curl -fsSL https://deno.land/install.sh | sh \
  && chown -R vscode ${DENO_INSTALL}
  
ENV PATH=${DENO_INSTALL}/bin:${PATH}