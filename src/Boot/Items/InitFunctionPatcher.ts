/*
	Boot/Items/InitFunctionPatcher.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { FunctionPatcher } from "../../FunctionPatcher";
import { LanguageFunctionPatcher } from "../../LanguageFunctionPatcher";

export const initFunctionPatcher = () => {
    FunctionPatcher();
	LanguageFunctionPatcher();
}