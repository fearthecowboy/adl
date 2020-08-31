# Build Instructions

Prerequisites: 
1. [Node.js](https://nodejs.org/en/download/) (>=14.0.0 <15.0.0)

2. [Rush](https://rushjs.io/pages/intro/welcome/) 

```
npm install -g @microsoft/rush
```

## Preparation
The first time (or after pulling from upstream) use Rush to install modules packages.
```
rush update 
```

## Building code
 - `rush rebuild` to build the modules
 or
 - `rush watch` to setup the build watcher 
 or
 - in VSCode, just build (ctrl-shift-b)