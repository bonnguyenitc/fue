# Fue CLI

- CLI giúp kéo base source đúng với ngôn ngữ cần dùng
- Source sẽ pull trực tiếp từ repo về
- Generate code

## Create new base

First time:
` npx fue-cli new`

##

After:
` fue new / fue-cli new`

<p align="center"><img src="https://gitlab-new.fue.jp/fue-project-base/cli/fue-cli/-/raw/main/dist/demo.png" alt="demo"></p>

## For development

```
git clone https://gitlab-new.fue.jp/fue-project-base/cli/fue-cli.git
cd fue-cli
yarn
yarn link
```

## Generate code

Ở mỗi source base có một folder `templates` sẽ chứa code ejs để gen code,
tên của folder là type file cần generate (model, component, module,...)

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
