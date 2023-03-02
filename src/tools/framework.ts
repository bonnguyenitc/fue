import { REPO_JAVA_SPRING, REPO_PHP_LARAVEL, REPO_REACT, REPO_REACT_NATIVE } from "./repository"

export const FRAMEWORKS: string[] = ["react", "react-native", "laravel", "spring"]

export const REACT = "react"
export const REACT_NATIVE = "react-native"
export const LARAVEL = "laravel"
export const SPRING = "spring"
export type FRAMEWORKS_TYPES = "react" | "react-native" | "laravel" | "spring"
export const FRAMEWORKS_DEFAULT: FRAMEWORKS_TYPES = "react-native"
export const REACT_NATIVE_BUNDLE_ID = "com.starter"
export const PACKAGE_DEFAULT = "yarn"

export const REPOSITORIES = {
  [REACT]: REPO_REACT,
  [REACT_NATIVE]: REPO_REACT_NATIVE,
  [LARAVEL]: REPO_PHP_LARAVEL,
  [SPRING]: REPO_JAVA_SPRING,
}
