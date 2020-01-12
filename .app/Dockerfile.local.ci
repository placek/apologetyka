FROM ruby:2.6
ENV LANG C.UTF-8
ARG BUNDLER_OPTIONS

RUN apt-get update -qq && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

ADD Gemfile ./Gemfile
ADD Gemfile.lock ./Gemfile.lock

RUN gem install bundler:2.0.1
RUN bundle install ${BUNDLER_OPTIONS}

COPY . .

CMD bundle exec rackup  --host 0.0.0.0

EXPOSE 3000
