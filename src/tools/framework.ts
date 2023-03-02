import { REPO_JAVA_SPRING, REPO_PHP_LARAVEL, REPO_REACT, REPO_REACT_NATIVE } from "./repository"

export const FRAMEWORKS: string[] = ["react", "react-native", "laravel", "spring"]
export type FRAMEWORKS_TYPES = "react" | "react-native" | "laravel" | "spring"
export const FRAMEWORKS_DEFAULT: FRAMEWORKS_TYPES = "react-native"
export const REACT_NATIVE_BUNDLE_ID = "com.starter"
export const PACKAGE_DEFAULT = "yarn"

export const REPOSITORIES = {
  [FRAMEWORKS[0]]: REPO_REACT,
  [FRAMEWORKS[1]]: REPO_REACT_NATIVE,
  [FRAMEWORKS[2]]: REPO_PHP_LARAVEL,
  [FRAMEWORKS[3]]: REPO_JAVA_SPRING,
}
