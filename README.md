# Fue CLI

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
   `fue g widget widget-name --react-native`
2. Generate modal
   `fue g modal modal-name --react-native`
3. Generate module
   `fue g module module-name --react-native`
4. Generate form
   `fue g form form-name --react-native`
5. Generate in form a specify dir
   `fue g form a/b/c/form-name --react-native`

#### In module

1. Generate widget
   `fue g widget widget-name --react-native --module=auth`
2. Generate modal
   `fue g modal modal-name --react-native --module=auth`
3. Generate module
   `fue g module module-name --react-native --module=auth`
4. Generate form
   `fue g form form-name --react-native --module=auth`
5. Generate screen
   `fue g screen screen-name --react-native --module=auth`
6. Generate in form a specify dir
   `fue g form a/b/c/form-name --react-native`
