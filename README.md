# Fue CLI

A CLI tool for generating code for [React Native template](https://github.com/bonnguyenitc/react-native-starter) is a command-line interface tool that automates the process of creating boilerplate code for React Native projects. It provides a streamlined way to generate code for common use cases, such as creating components, screens, and module.

## Create new base

First time:
` npx fue-cli new`

##

After:
` fue new / fue-cli new`

## For development

```
git clone https://github.com/bonnguyenitc/fue.git
cd fue-cli
yarn
yarn link
```

## Generate code

### React Native

#### In root

1. Generate widget
   `fue g widget widget-name --reactnative`
2. Generate modal
   `fue g modal modal-name --reactnative`
3. Generate module
   `fue g module module-name --reactnative`
4. Generate form
   `fue g form form-name --reactnative`
5. Generate in form a specify dir
   `fue g form a/b/c/form-name --reactnative`

#### In module

1. Generate widget
   `fue g widget widget-name --reactnative --module=auth`
2. Generate modal
   `fue g modal modal-name --reactnative --module=auth`
3. Generate module
   `fue g module module-name --reactnative --module=auth`
4. Generate form
   `fue g form form-name --reactnative --module=auth`
5. Generate screen
   `fue g screen screen-name --reactnative --module=auth`
6. Generate in form a specify dir
   `fue g form a/b/c/form-name --reactnative`
