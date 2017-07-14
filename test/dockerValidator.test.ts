/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { TextDocument, Diagnostic, DiagnosticSeverity } from 'vscode-languageserver';
import { Validator, ValidationCode, ValidationSeverity } from '../src/dockerValidator';
import { ValidatorSettings } from '../src/dockerValidatorSettings';
import { KEYWORDS } from '../src/docker';

let source = "dockerfile-lsp";

function createDocument(content: string): any {
	return TextDocument.create("uri://host/Dockerfile.sample", "dockerfile", 1, content);
}

function validate(content: string, settings?: ValidatorSettings) {
	if (!settings) {
		settings = {
			deprecatedMaintainer: ValidationSeverity.IGNORE
		};
	}
	let validator = new Validator(settings);
	return validator.validate(KEYWORDS, createDocument(content));
}

function assertDiagnostics(diagnostics: Diagnostic[], codes: ValidationCode[], functions: Function[], args: any[][]) {
	assert.equal(diagnostics.length, codes.length);
	diagnosticCheck: for (let diagnostic of diagnostics) {
		for (let i = 0; i < codes.length; i++) {
			if (diagnostic.code === codes[i]) {
				args[i].unshift(diagnostic);
				functions[i].apply(null, args[i]);
				continue diagnosticCheck;
			}
		}
		throw new Error("Diagnostic with code " + diagnostic.code + " not expected");
	}
}

function assertNoSourceImage(diagnostic: Diagnostic, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
	assert.equal(diagnostic.code, ValidationCode.NO_SOURCE_IMAGE);
	assert.equal(diagnostic.severity, DiagnosticSeverity.Error);
	assert.equal(diagnostic.source, source);
	assert.equal(diagnostic.message, Validator.getDiagnosticMessage_NoSourceImage());
	assert.equal(diagnostic.range.start.line, startLine);
	assert.equal(diagnostic.range.start.character, startCharacter);
	assert.equal(diagnostic.range.end.line, endLine);
	assert.equal(diagnostic.range.end.character, endCharacter);
}

function assertInvalidAs(diagnostic: Diagnostic, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
	assert.equal(diagnostic.code, ValidationCode.INVALID_AS);
	assert.equal(diagnostic.severity, DiagnosticSeverity.Error);
	assert.equal(diagnostic.source, source);
	assert.equal(diagnostic.message, Validator.getDiagnosticMessage_InvalidAs());
	assert.equal(diagnostic.range.start.line, startLine);
	assert.equal(diagnostic.range.start.character, startCharacter);
	assert.equal(diagnostic.range.end.line, endLine);
	assert.equal(diagnostic.range.end.character, endCharacter);
}

function assertInvalidPort(diagnostic: Diagnostic, port: string, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
	assert.equal(diagnostic.code, ValidationCode.INVALID_PORT);
	assert.equal(diagnostic.severity, DiagnosticSeverity.Error);
	assert.equal(diagnostic.source, source);
	assert.equal(diagnostic.message, Validator.getDiagnosticMessage_InvalidPort(port));
	assert.equal(diagnostic.range.start.line, startLine);
	assert.equal(diagnostic.range.start.character, startCharacter);
	assert.equal(diagnostic.range.end.line, endLine);
	assert.equal(diagnostic.range.end.character, endCharacter);
}

function assertInvalidStopSignal(diagnostic: Diagnostic, signal: string, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
	assert.equal(diagnostic.code, ValidationCode.INVALID_SIGNAL);
	assert.equal(diagnostic.severity, DiagnosticSeverity.Error);
	assert.equal(diagnostic.source, source);
	assert.equal(diagnostic.message, Validator.getDiagnosticMessage_InvalidSignal(signal));
	assert.equal(diagnostic.range.start.line, startLine);
	assert.equal(diagnostic.range.start.character, startCharacter);
	assert.equal(diagnostic.range.end.line, endLine);
	assert.equal(diagnostic.range.end.character, endCharacter);
}

function assertInstructionCasing(diagnostic: Diagnostic, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
	assert.equal(diagnostic.code, ValidationCode.LOWERCASE);
	assert.equal(diagnostic.severity, DiagnosticSeverity.Warning);
	assert.equal(diagnostic.source, source);
	assert.equal(diagnostic.message, Validator.getDiagnosticMessage_InstructionCasing());
	assert.equal(diagnostic.range.start.line, startLine);
	assert.equal(diagnostic.range.start.character, startCharacter);
	assert.equal(diagnostic.range.end.line, endLine);
	assert.equal(diagnostic.range.end.character, endCharacter);
}

function assertInstructionExtraArgument(diagnostic: Diagnostic, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
	assert.equal(diagnostic.code, ValidationCode.ARGUMENT_EXTRA);
	assert.equal(diagnostic.severity, DiagnosticSeverity.Error);
	assert.equal(diagnostic.source, source);
	assert.equal(diagnostic.message, Validator.getDiagnosticMessage_InstructionExtraArgument());
	assert.equal(diagnostic.range.start.line, startLine);
	assert.equal(diagnostic.range.start.character, startCharacter);
	assert.equal(diagnostic.range.end.line, endLine);
	assert.equal(diagnostic.range.end.character, endCharacter);
}

function assertInstructionMissingArgument(diagnostic: Diagnostic, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
	assert.equal(diagnostic.code, ValidationCode.ARGUMENT_MISSING);
	assert.equal(diagnostic.severity, DiagnosticSeverity.Error);
	assert.equal(diagnostic.source, source);
	assert.equal(diagnostic.message, Validator.getDiagnosticMessage_InstructionMissingArgument());
	assert.equal(diagnostic.range.start.line, startLine);
	assert.equal(diagnostic.range.start.character, startCharacter);
	assert.equal(diagnostic.range.end.line, endLine);
	assert.equal(diagnostic.range.end.character, endCharacter);
}

function assertInstructionRequiresOneArgument(diagnostic: Diagnostic, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
	assert.equal(diagnostic.code, ValidationCode.ARGUMENT_REQUIRES_ONE);
	assert.equal(diagnostic.severity, DiagnosticSeverity.Error);
	assert.equal(diagnostic.source, source);
	assert.equal(diagnostic.message, Validator.getDiagnosticMessage_ARGRequiresOneArgument());
	assert.equal(diagnostic.range.start.line, startLine);
	assert.equal(diagnostic.range.start.character, startCharacter);
	assert.equal(diagnostic.range.end.line, endLine);
	assert.equal(diagnostic.range.end.character, endCharacter);
}

function assertInstructionRequiresOneOrThreeArguments(diagnostic: Diagnostic, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
	assert.equal(diagnostic.code, ValidationCode.ARGUMENT_REQUIRES_ONE_OR_THREE);
	assert.equal(diagnostic.severity, DiagnosticSeverity.Error);
	assert.equal(diagnostic.source, source);
	assert.equal(diagnostic.message, Validator.getDiagnosticMessage_InstructionRequiresOneOrThreeArguments());
	assert.equal(diagnostic.range.start.line, startLine);
	assert.equal(diagnostic.range.start.character, startCharacter);
	assert.equal(diagnostic.range.end.line, endLine);
	assert.equal(diagnostic.range.end.character, endCharacter);
}

function assertInstructionUnknown(diagnostic: Diagnostic, instruction: string, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
	assert.equal(diagnostic.code, ValidationCode.UNKNOWN_INSTRUCTION);
	assert.equal(diagnostic.severity, DiagnosticSeverity.Error);
	assert.equal(diagnostic.source, source);
	assert.equal(diagnostic.message, Validator.getDiagnosticMessage_InstructionUnknown(instruction));
	assert.equal(diagnostic.range.start.line, startLine);
	assert.equal(diagnostic.range.start.character, startCharacter);
	assert.equal(diagnostic.range.end.line, endLine);
	assert.equal(diagnostic.range.end.character, endCharacter);
}

function assertDirectiveEscapeInvalid(diagnostic: Diagnostic, value: string, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
	assert.equal(diagnostic.code, ValidationCode.INVALID_ESCAPE_DIRECTIVE);
	assert.equal(diagnostic.severity, DiagnosticSeverity.Error);
	assert.equal(diagnostic.source, source);
	assert.equal(diagnostic.message, Validator.getDiagnosticMessage_DirectiveEscapeInvalid(value));
	assert.equal(diagnostic.range.start.line, startLine);
	assert.equal(diagnostic.range.start.character, startCharacter);
	assert.equal(diagnostic.range.end.line, endLine);
	assert.equal(diagnostic.range.end.character, endCharacter);
}

function assertDeprecatedMaintainer(diagnostic: Diagnostic, severity: DiagnosticSeverity, startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
	assert.equal(diagnostic.code, ValidationCode.DEPRECATED_MAINTAINER);
	assert.equal(diagnostic.severity, severity);
	assert.equal(diagnostic.source, source);
	assert.equal(diagnostic.message, Validator.getDiagnosticMessage_DeprecatedMaintainer());
	assert.equal(diagnostic.range.start.line, startLine);
	assert.equal(diagnostic.range.start.character, startCharacter);
	assert.equal(diagnostic.range.end.line, endLine);
	assert.equal(diagnostic.range.end.character, endCharacter);
}

function testValidArgument(instruction: string, argument: string) {
	let gaps = [ " ", "\t", " \\\n", " \\\r", " \\\r\n" ];
	for (let gap of gaps) {
		let diagnostics = validate("FROM node\n" + instruction + gap + argument);
		assert.equal(diagnostics.length, 0);

		diagnostics = validate("FROM node\n" + instruction + gap + argument + " ");
		assert.equal(diagnostics.length, 0);

		diagnostics = validate("FROM node\n" + instruction + gap + argument + "\n");
		assert.equal(diagnostics.length, 0);

		diagnostics = validate("FROM node\n" + instruction + gap + argument + "\r");
		assert.equal(diagnostics.length, 0);

		diagnostics = validate("FROM node\n" + instruction + gap + argument + "\r\n");
		assert.equal(diagnostics.length, 0);

		diagnostics = validate("FROM node\n" + instruction + gap + argument + " \n");
		assert.equal(diagnostics.length, 0);

		diagnostics = validate("FROM node\n" + instruction + gap + argument + " \r");
		assert.equal(diagnostics.length, 0);

		diagnostics = validate("FROM node\n" + instruction + gap + argument + " \r\n");
		assert.equal(diagnostics.length, 0);

		diagnostics = validate("FROM node\n" + instruction + gap + argument + "\n ");
		assert.equal(diagnostics.length, 0);

		diagnostics = validate("FROM node\n" + instruction + gap + argument + "\r ");
		assert.equal(diagnostics.length, 0);

		diagnostics = validate("FROM node\n" + instruction + gap + argument + "\r\n ");
		assert.equal(diagnostics.length, 0);
	}
}

function testEscape(instruction: string, argumentFront: string, argumentBack: string) {
	var argument = argumentFront + argumentBack;
	let diagnostics = validate("FROM node\n" + instruction + " \\\n" + argument);
	assert.equal(diagnostics.length, 0);
	
	diagnostics = validate("FROM node\n" + instruction + " \\\n " + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + "\\\n " + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " \\ \n" + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + "\\ \n " + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " \\ \n " + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " \\  \n " + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " \\\t\n " + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " \\\t\t\n " + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " \\  \r " + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " \\\t\r " + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " \\\t\t\r " + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " \\\r\n" + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + "\\\r\n " + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " \\\r\n " + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " \\ \r\n" + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + "\\ \r\n " + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " \\ \r\n " + argument);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " " + argument + "\\\n");
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " " + argumentFront + "\\\n" + argumentBack);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " " + argumentFront + "\\\r\n" + argumentBack);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " " + argumentFront + "\\\r\n" + argumentBack);
	assert.equal(diagnostics.length, 0);

	diagnostics = validate("FROM node\n" + instruction + " " + argumentFront + "\\\r\n" + argumentBack + "\n");
	assert.equal(diagnostics.length, 0);
}

describe("Docker Validator Tests", function() {
	describe("no content", function() {
		it("empty file", function() {
			let diagnostics = validate("");
			assert.equal(diagnostics.length, 1);
			assertNoSourceImage(diagnostics[0], 0, 0, 0, 0);
		});

		it("whitespace only", function() {
			let diagnostics = validate(" \t\r\n");
			assert.equal(diagnostics.length, 1);
			assertNoSourceImage(diagnostics[0], 0, 0, 0, 0);
		});

		it("comments only", function() {
			let diagnostics = validate("# This is a comment");
			assert.equal(diagnostics.length, 1);
			assertNoSourceImage(diagnostics[0], 0, 0, 0, 0);

			diagnostics = validate("#=This is a comment");
			assert.equal(diagnostics.length, 1);
			assertNoSourceImage(diagnostics[0], 0, 0, 0, 0);
		});

		it("directive only", function() {
			let diagnostics = validate("# escape=`");
			assert.equal(diagnostics.length, 1);
			assertNoSourceImage(diagnostics[0], 0, 0, 0, 0);

			diagnostics = validate("# escape=\\");
			assert.equal(diagnostics.length, 1);
			assertNoSourceImage(diagnostics[0], 0, 0, 0, 0);
		});

		it("FROM in comment", function() {
			let diagnostics = validate("# FROM node");
			assert.equal(diagnostics.length, 1);
			assertNoSourceImage(diagnostics[0], 0, 0, 0, 0);
		});
	});

	describe("instruction", function() {
		describe("uppercase style check", function() {
			function testCasingStyle(mixed: string, argument: string) {
				var length = mixed.length;
				let diagnostics = validate("FROM node\n" + mixed.toUpperCase() + " " + argument);
				assert.equal(diagnostics.length, 0);

				diagnostics = validate("FROM node\n" + mixed.toLowerCase() + " " + argument);
				assert.equal(diagnostics.length, 1);
				assertInstructionCasing(diagnostics[0], 1, 0, 1, length);

				diagnostics = validate("FROM node\n" + mixed + " " + argument);
				assert.equal(diagnostics.length, 1);
				assertInstructionCasing(diagnostics[0], 1, 0, 1, length);

				diagnostics = validate("FROM node\n#" + mixed.toLowerCase() + " " + argument);
				assert.equal(diagnostics.length, 0);
			}

			it("ADD", function() {
				testCasingStyle("aDd", "source dest");
			});

			it("ARG", function() {
				testCasingStyle("aRg", "name");
			});

			it("CMD", function() {
				testCasingStyle("cMd", "[ \"/bin/ls\" ]");
			});

			it("COPY", function() {
				testCasingStyle("copY", "source dest");
			});

			it("ENTRYPOINT", function() {
				testCasingStyle("entryPOINT", "[ \"/usr/bin/sh\" ]");
			});

			it("ENV", function() {
				testCasingStyle("EnV", "key=value");
			});

			it("EXPOSE", function() {
				testCasingStyle("expOSe", "8080");
			});

			it("FROM", function() {
				testCasingStyle("fROm", "node");
			});

			it("HEALTHCHECK", function() {
				testCasingStyle("healTHCHeck", "NONE");
			});

			it("LABEL", function() {
				testCasingStyle("LAbel", "key=value");
			});

			it("MAINTAINER", function() {
				testCasingStyle("maINTaiNER", "authorName");
			});

			it("ONBUILD", function() {
				testCasingStyle("onBUILD", "HEALTHCHECK NONE");
			});

			it("RUN", function() {
				testCasingStyle("rUN", "apt-get update");
			});

			it("SHELL", function() {
				testCasingStyle("shELL", "[ \"powershell\" ]");
			});

			it("STOPSIGNAL", function() {
				testCasingStyle("stopSIGNal", "9");
			});

			it("USER", function() {
				testCasingStyle("uSEr", "daemon");
			});

			it("VOLUME", function() {
				testCasingStyle("VOLume", "[ \"/data\" ]");
			});

			it("WORKDIR", function() {
				testCasingStyle("workDIR", "/path");
			});
		});

		describe("extra argument", function() {
			function testExtraArgument(prefix: string, assertDiagnostic: Function) {
				let length = prefix.length;
				let diagnostics = validate("FROM node\n" + prefix + " extra");
				assert.equal(diagnostics.length, 1);
				assertDiagnostic(diagnostics[0], 1, length + 1, 1, length + 6);

				diagnostics = validate("FROM node\n" + prefix + " extra\r");
				assert.equal(diagnostics.length, 1);
				assertDiagnostic(diagnostics[0], 1, length + 1, 1, length + 6);

				diagnostics = validate("FROM node\n" + prefix + " extra ");
				assert.equal(diagnostics.length, 1);
				assertDiagnostic(diagnostics[0], 1, length + 1, 1, length + 6);

				diagnostics = validate("FROM node\n" + prefix + " extra\t");
				assert.equal(diagnostics.length, 1);
				assertDiagnostic(diagnostics[0], 1, length + 1, 1, length + 6);

				diagnostics = validate("FROM node\n" + prefix + " extra\n");
				assert.equal(diagnostics.length, 1);
				assertDiagnostic(diagnostics[0], 1, length + 1, 1, length + 6);

				diagnostics = validate("FROM node\n" + prefix + " \\\nextra");
				assert.equal(diagnostics.length, 1);
				assertDiagnostic(diagnostics[0], 2, 0, 2, 5);

				diagnostics = validate("FROM node\n" + prefix + " \\\r\nextra");
				assert.equal(diagnostics.length, 1);
				assertDiagnostic(diagnostics[0], 2, 0, 2, 5);

				diagnostics = validate("FROM node\n" + prefix + " \\\r\nextra");
				assert.equal(diagnostics.length, 1);
				assertDiagnostic(diagnostics[0], 2, 0, 2, 5);
			}

			it("FROM", function() {
				testExtraArgument("FROM node", assertInstructionRequiresOneOrThreeArguments);
			});

			it("STOPSIGNAL", function() {
				testExtraArgument("STOPSIGNAL SIGTERM", assertInstructionExtraArgument);
			});
		});

		describe("missing argument", function() {
			function testMissingArgument(instruction: string, prefix: string, middle: string, suffix: string) {
				var length = instruction.length;
				let diagnostics = validate("FROM node\n" + instruction + prefix + middle + suffix);
				assert.equal(diagnostics.length, 1);
				assertInstructionMissingArgument(diagnostics[0], 1, 0, 1, length);
			}

			function testMissingArgumentLoop(instruction: string) {
				let newlines = [ "", "\r", "\n", "\r\n", "\\\r", "\\\n", "\\\r\n" ];
				for (let newline of newlines) {
					testMissingArgument(instruction, "", newline, "");
					testMissingArgument(instruction, "", newline, " ");
					testMissingArgument(instruction, " ", newline, "");
					testMissingArgument(instruction, " ", newline, " ");
					testMissingArgument(instruction, "", newline, "\t");
					testMissingArgument(instruction, "\t", newline, "");
					testMissingArgument(instruction, "\t", newline, "\t");
				}
			}

			it("ADD", function() {
				return testMissingArgumentLoop("ADD");
			});

			it("ARG", function() {
				return testMissingArgumentLoop("ARG");
			});

			it("CMD", function() {
				return testMissingArgumentLoop("CMD");
			});

			it("COPY", function() {
				return testMissingArgumentLoop("COPY");
			});

			it("ENTRYPOINT", function() {
				return testMissingArgumentLoop("ENTRYPOINT");
			});

			it("ENV", function() {
				return testMissingArgumentLoop("ENV");
			});

			it("EXPOSE", function() {
				return testMissingArgumentLoop("EXPOSE");
			});

			it("FROM", function() {
				return testMissingArgumentLoop("FROM");
			});

			it("HEALTHCHECK", function() {
				return testMissingArgumentLoop("HEALTHCHECK");
			});

			it("LABEL", function() {
				return testMissingArgumentLoop("LABEL");
			});

			it("MAINTAINER", function() {
				return testMissingArgumentLoop("MAINTAINER");
			});

			it("ONBUILD", function() {
				return testMissingArgumentLoop("ONBUILD");
			});

			it("RUN", function() {
				return testMissingArgumentLoop("RUN");
			});

			it("SHELL", function() {
				return testMissingArgumentLoop("SHELL");
			});

			it("STOPSIGNAL", function() {
				return testMissingArgumentLoop("STOPSIGNAL");
			});

			it("USER", function() {
				return testMissingArgumentLoop("USER");
			});

			it("WORKDIR", function() {
				return testMissingArgumentLoop("WORKDIR");
			});
		});

		describe("escaped instruction", function() {
			function testEscapedInstruction(instructionPrefix: string, middle: string, instructionSuffix: string, args: string) {
				let diagnostics = validate("FROM node\n" + instructionPrefix + middle + instructionSuffix + " " + args);
				if (diagnostics.length !== 0) console.log(diagnostics[0]);
				assert.equal(diagnostics.length, 0);
			}

			function testEscapedInstructionLoop(instruction: string, args: string) {
				let newlines = [ "\\\n", "\\\r", "\\\r\n", "\\ \n", "\\ \r", "\\ \r\n", "\\\t\n", "\\\t\r", "\\\t\r\n" ];
				for (let newline of newlines) {
					testEscapedInstruction(instruction.substring(0, 1), newline, instruction.substring(1), args);
				}
			}

			it("ADD", function() {
				testEscapedInstructionLoop("ADD", "source dest");
			});

			it("ARG", function() {
				testEscapedInstructionLoop("ARG", "name");
			});

			it("CMD", function() {
				testEscapedInstructionLoop("CMD", "[ \"/bin/ls\" ]");
			});

			it("COPY", function() {
				testEscapedInstructionLoop("COPY", "source dest");
			});

			it("ENTRYPOINT", function() {
				testEscapedInstructionLoop("ENTRYPOINT", "[ \"/usr/bin/sh\" ]");
			});

			it("ENV", function() {
				testEscapedInstructionLoop("ENV", "key=value");
			});

			it("EXPOSE", function() {
				testEscapedInstructionLoop("EXPOSE", "8080");
			});

			it("FROM", function() {
				testEscapedInstructionLoop("FROM", "node");
			});

			it("HEALTHCHECK", function() {
				testEscapedInstructionLoop("HEALTHCHECK", "NONE");
			});

			it("LABEL", function() {
				testEscapedInstructionLoop("LABEL", "key=value");
			});

			it("MAINTAINER", function() {
				testEscapedInstructionLoop("MAINTAINER", "authorName");
			});

			it("ONBUILD", function() {
				testEscapedInstructionLoop("ONBUILD", "HEALTHCHECK NONE");
			});

			it("RUN", function() {
				testEscapedInstructionLoop("RUN", "apt-get update");
			});

			it("SHELL", function() {
				testEscapedInstructionLoop("SHELL", "[ \"powershell\" ]");
			});

			it("STOPSIGNAL", function() {
				testEscapedInstructionLoop("STOPSIGNAL", "9");
			});

			it("USER", function() {
				testEscapedInstructionLoop("USER", "daemon");
			});

			it("VOLUME", function() {
				testEscapedInstructionLoop("VOLUME", "[ \"/data\" ]");
			});

			it("WORKDIR", function() {
				testEscapedInstructionLoop("WORKDIR", "/path");
			});
		});

		describe("unknown", function () {
			it("simple", function () {
				let diagnostics = validate("FROM node\nRUNCMD docker");
				assert.equal(diagnostics.length, 1);
				assertInstructionUnknown(diagnostics[0], "RUNCMD", 1, 0, 1, 6);

				diagnostics = validate("FROM node\nRUNCMD docker\n");
				assert.equal(diagnostics.length, 1);
				assertInstructionUnknown(diagnostics[0], "RUNCMD", 1, 0, 1, 6);

				diagnostics = validate("FROM node\nRUNCMD docker\r\n");
				assert.equal(diagnostics.length, 1);
				assertInstructionUnknown(diagnostics[0], "RUNCMD", 1, 0, 1, 6);

				diagnostics = validate("FROM node\nRUNCMD docker\\\n");
				assert.equal(diagnostics.length, 1);
				assertInstructionUnknown(diagnostics[0], "RUNCMD", 1, 0, 1, 6);

				diagnostics = validate("FROM node\nR\\UN docker\n");
				assert.equal(diagnostics.length, 1);
				assertInstructionUnknown(diagnostics[0], "R\\UN", 1, 0, 1, 4);
			});

			it("escape", function () {
				let diagnostics = validate("FROM node\nSTOPSIGNAL\\\n9");
				assert.equal(diagnostics.length, 1);
				assertInstructionUnknown(diagnostics[0], "STOPSIGNAL9", 1, 0, 2, 1);

				diagnostics = validate("FROM node\nSTOPSIGNAL\\\n9 ");
				assert.equal(diagnostics.length, 1);
				assertInstructionUnknown(diagnostics[0], "STOPSIGNAL9", 1, 0, 2, 1);

				diagnostics = validate("FROM node\nSTOPSIGNAL\\\r\n9");
				assert.equal(diagnostics.length, 1);
				assertInstructionUnknown(diagnostics[0], "STOPSIGNAL9", 1, 0, 2, 1);

				diagnostics = validate("FROM node\nSTOPSIGNAL\\\r\n9 ");
				assert.equal(diagnostics.length, 1);
				assertInstructionUnknown(diagnostics[0], "STOPSIGNAL9", 1, 0, 2, 1);

				diagnostics = validate("FROM node\nSTOPSIGNAL\\ \n9");
				assert.equal(diagnostics.length, 1);
				assertInstructionUnknown(diagnostics[0], "STOPSIGNAL9", 1, 0, 2, 1);

				diagnostics = validate("FROM node\nSTOPSIGNAL\\ \t\n9");
				assert.equal(diagnostics.length, 1);
				assertInstructionUnknown(diagnostics[0], "STOPSIGNAL9", 1, 0, 2, 1);

				diagnostics = validate("FROM node\nSTOPSIGNAL\\  \n9");
				assert.equal(diagnostics.length, 1);
				assertInstructionUnknown(diagnostics[0], "STOPSIGNAL9", 1, 0, 2, 1);

				diagnostics = validate("FROM node\nSTOPSIGNAL\\ \r\n9");
				assert.equal(diagnostics.length, 1);
				assertInstructionUnknown(diagnostics[0], "STOPSIGNAL9", 1, 0, 2, 1);

				diagnostics = validate("FROM node\nSTOPSIGNAL\\ \r9");
				assert.equal(diagnostics.length, 1);
				assertInstructionUnknown(diagnostics[0], "STOPSIGNAL9", 1, 0, 2, 1);

				diagnostics = validate("\\FROM node");
				assert.equal(diagnostics.length, 2);
				assertDiagnostics(diagnostics,
					[ ValidationCode.UNKNOWN_INSTRUCTION, ValidationCode.NO_SOURCE_IMAGE ],
					[ assertInstructionUnknown, assertNoSourceImage ],
					[ [ "\\FROM", 0, 0, 0, 5 ], [ 0, 0, 0, 5 ] ]);
			});

			/**
			 * Checks that an unknown instruction that is written in lowercase only
			 * receives one error about the unknown instruction.
			 */
			it("does not overlap with casing", function () {
				let diagnostics = validate("FROM node\nruncmd docker");
				assert.equal(diagnostics.length, 1);
				assertInstructionUnknown(diagnostics[0], "RUNCMD", 1, 0, 1, 6);
			});
		});

		describe("first instruction not FROM", function() {
			it("one line", function() {
				let diagnostics = validate("EXPOSE 8080");
				assert.equal(diagnostics.length, 1);
				assertNoSourceImage(diagnostics[0], 0, 0, 0, 6);
			});

			it("two lines", function() {
				let diagnostics = validate("EXPOSE 8080\n# another line");
				assert.equal(diagnostics.length, 1);
				assertNoSourceImage(diagnostics[0], 0, 0, 0, 6);
			});

			it("two instructions", function() {
				let diagnostics = validate("EXPOSE 8080\nEXPOSE 8081");
				assert.equal(diagnostics.length, 1);
				assertNoSourceImage(diagnostics[0], 0, 0, 0, 6);
			});

			it("comments ignored", function() {
				let diagnostics = validate("# FROM node\nEXPOSE 8080");
				assert.equal(diagnostics.length, 1);
				assertNoSourceImage(diagnostics[0], 1, 0, 1, 6);
			});
		});

		describe("ARG before FROM", function() {
			it("single", function() {
				let diagnostics = validate("ARG x\nFROM node");
				assert.equal(diagnostics.length, 0);
			});

			it("double", function() {
				let diagnostics = validate("ARG x\nARG y\nFROM node");
				assert.equal(diagnostics.length, 0);
			});
		});

		describe("ARG before EXPOSE", function() {
			it("invalid", function() {
				let diagnostics = validate("ARG x\nEXPOSE 8080");
				assert.equal(diagnostics.length, 1);
				assertNoSourceImage(diagnostics[0], 1, 0, 1, 6);
			});
		});

		describe("ARG only", function() {
			it("invalid", function() {
				let diagnostics = validate("ARG x\nARG y\nARG z");
				assert.equal(diagnostics.length, 1);
				assertNoSourceImage(diagnostics[0], 0, 0, 0, 0);
			});
		});
	});

	describe("directives", function() {
		describe("unknown directive", function() {
			it("simple", function() {
				let diagnostics = validate("# key=value\nFROM node");
				assert.equal(diagnostics.length, 0);
			});

			it("simple EOF", function() {
				let diagnostics = validate("# key=value");
				assert.equal(diagnostics.length, 1);
				assertNoSourceImage(diagnostics[0], 0, 0, 0, 0);
			});

			it("whitespace", function() {
				let diagnostics = validate("# key = value\nFROM node");
				assert.equal(diagnostics.length, 0);
			});

			it("ignored after one comment", function() {
				let diagnostics = validate("# This is a comment\n# key=value\nFROM node");
				assert.equal(diagnostics.length, 0);

				diagnostics = validate("#\r# key=value\nFROM node");
				assert.equal(diagnostics.length, 0);

				diagnostics = validate("#=# key=value\nFROM node");
				assert.equal(diagnostics.length, 0);

				diagnostics = validate("#=# key=value\r\nFROM node");
				assert.equal(diagnostics.length, 0);
			});

			it("ignored after one instruction", function() {
				let diagnostics = validate("FROM node\n# key=value");
				assert.equal(diagnostics.length, 0);
			});
		});

		describe("escape validation", function() {
			it("backtick", function() {
				let diagnostics = validate("# escape=`\nFROM node");
				assert.equal(diagnostics.length, 0);
			});

			it("whitespace around the value", function() {
				let diagnostics = validate("# escape =  `  \nFROM node");
				assert.equal(diagnostics.length, 0);
			});

			it("casing ignored", function() {
				let diagnostics = validate("# EsCaPe=`\nFROM node");
				assert.equal(diagnostics.length, 0);
			});

			it("invalid escape directive", function() {
				let diagnostics = validate("# escape=ab\nFROM node");
				assert.equal(diagnostics.length, 1);
				assertDirectiveEscapeInvalid(diagnostics[0], "ab", 0, 9, 0, 11);

				diagnostics = validate("# escape=ab\r\nFROM node");
				assert.equal(diagnostics.length, 1);
				assertDirectiveEscapeInvalid(diagnostics[0], "ab", 0, 9, 0, 11);
			});

			it("value set to whitespace", function() {
				let diagnostics = validate("#escape= \nFROM node");
				assert.equal(diagnostics.length, 1);
				assertDirectiveEscapeInvalid(diagnostics[0], " ", 0, 8, 0, 9);
				
				diagnostics = validate("#escape=\t\nFROM node");
				assert.equal(diagnostics.length, 1);
				assertDirectiveEscapeInvalid(diagnostics[0], "\t", 0, 8, 0, 9);
			});

			it("EOF", function() {
				let diagnostics = validate("#escape=");
				assert.equal(diagnostics.length, 1);
				assertNoSourceImage(diagnostics[0], 0, 0, 0, 0);
			});

			it("EOF newline", function() {
				let diagnostics = validate("#escape=\n");
				assert.equal(diagnostics.length, 1);
				assertNoSourceImage(diagnostics[0], 0, 0, 0, 0);
			});
		});
	});

	describe("ARG", function() {
		it("ok", function() {
			testValidArgument("ARG", "a=b");
			testValidArgument("ARG", "a=\"a b\"");
			testValidArgument("ARG", "a='a b'");
		});

		it("escape", function() {
			testValidArgument("ARG", "a=a\\ x");
			testValidArgument("ARG", "a=a\\");
			testValidArgument("ARG", "a=a\\b");
			testValidArgument("ARG", "a=a\\\\b");
			testValidArgument("ARG", "a=\"a\\ x\"");
			testValidArgument("ARG", "a='a\\ x'");
			testValidArgument("ARG", "a=a\\\nx");
			testValidArgument("ARG", "a=a\\ \nx");
			testValidArgument("ARG", "a=a\\\rx");
			testValidArgument("ARG", "a=a\\ \rx");
			testValidArgument("ARG", "a=a\\\r\nx");
			testValidArgument("ARG", "a=a\\ \r\nx");
			testValidArgument("ARG", "a=\"a \\\nx\"");
			testValidArgument("ARG", "a=\"a \\\rx\"");
			testValidArgument("ARG", "a=\"a \\\r\nx\"");
			testValidArgument("ARG", "a=\'a \\\nx'");
			testValidArgument("ARG", "a=\'a \\\rx'");
			testValidArgument("ARG", "a=\'a \\\r\nx'");
		});

		it("invalid", function() {
			let diagnostics = validate("FROM busybox\nARG a=a b");
			assert.equal(diagnostics.length, 1);
			assertInstructionRequiresOneArgument(diagnostics[0], 1, 8, 1, 9);

			diagnostics = validate("FROM busybox\nARG a=a\\  b");
			assert.equal(diagnostics.length, 1);
			assertInstructionRequiresOneArgument(diagnostics[0], 1, 10, 1, 11);

			diagnostics = validate("FROM busybox\nARG a=a\\\\ b");
			assert.equal(diagnostics.length, 1);
			assertInstructionRequiresOneArgument(diagnostics[0], 1, 10, 1, 11);

			diagnostics = validate("FROM busybox\nARG a=a\\\n b");
			assert.equal(diagnostics.length, 1);
			assertInstructionRequiresOneArgument(diagnostics[0], 2, 1, 2, 2);

			diagnostics = validate("FROM busybox\nARG a=a\\\r b");
			assert.equal(diagnostics.length, 1);
			assertInstructionRequiresOneArgument(diagnostics[0], 2, 1, 2, 2);

			diagnostics = validate("FROM busybox\nARG a=a\\\r\n b");
			assert.equal(diagnostics.length, 1);
			assertInstructionRequiresOneArgument(diagnostics[0], 2, 1, 2, 2);

			diagnostics = validate("FROM busybox\nARG a=a\\ \\b \\c");
			assert.equal(diagnostics.length, 1);
			assertInstructionRequiresOneArgument(diagnostics[0], 1, 12, 1, 14);
		});
	});

	describe("EXPOSE", function() {
		it("ok", function() {
			testValidArgument("EXPOSE", "8080");
			testValidArgument("EXPOSE", "80\\80");
			testValidArgument("EXPOSE", "7000-8000");
		});

		it("escape", function() {
			let diagnostics = validate("FROM node\nEXPOSE 8080\\\n8081");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nEXPOSE 8080\\\r\n8081");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nEXPOSE 8080 \\\n8081");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nEXPOSE \\\n8080");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nEXPOSE \\\n 8080");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nEXPOSE \\\n8080\n");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nEXPOSE \\\n 8080\n");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nEXPOSE \\\n8080 \n");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nEXPOSE \\\n 8080 \n");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nEXPOSE 8080\\\n");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nEXPOSE 80\\\n80");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nEXPOSE 8000-\\\n9000");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nEXPOSE 8000\\\n-9000");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nEXPOSE 80\\\r\n80");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nEXPOSE 8000-\\\r\n9000");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nEXPOSE 8000\\\r\n-9000");
			assert.equal(diagnostics.length, 0);
		});

		it("invalid containerPort", function() {
			let diagnostics = validate("FROM node\nEXPOSE a");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "a", 1, 7, 1, 8);

			diagnostics = validate("FROM node\nEXPOSE a ");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "a", 1, 7, 1, 8);

			diagnostics = validate("FROM node\nEXPOSE a\n");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "a", 1, 7, 1, 8);

			diagnostics = validate("FROM node\nEXPOSE a\r");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "a", 1, 7, 1, 8);

			diagnostics = validate("FROM node\nEXPOSE a\r\n");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "a", 1, 7, 1, 8);

			diagnostics = validate("FROM node\nEXPOSE a\\\n ");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "a", 1, 7, 1, 8);

			diagnostics = validate("FROM node\nEXPOSE ab\\\n ");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "ab", 1, 7, 1, 9);

			diagnostics = validate("FROM node\nEXPOSE a\r");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "a", 1, 7, 1, 8);

			diagnostics = validate("FROM node\nEXPOSE a\\\r ");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "a", 1, 7, 1, 8);

			diagnostics = validate("FROM node\nEXPOSE ab\\\r ");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "ab", 1, 7, 1, 9);

			diagnostics = validate("FROM node\nEXPOSE a\r\n");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "a", 1, 7, 1, 8);

			diagnostics = validate("FROM node\nEXPOSE a\\\r\n ");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "a", 1, 7, 1, 8);

			diagnostics = validate("FROM node\nEXPOSE ab\\\r\n ");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "ab", 1, 7, 1, 9);

			diagnostics = validate("FROM node\nEXPOSE -8000");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "-8000", 1, 7, 1, 12);

			diagnostics = validate("FROM node\nEXPOSE -8000 ");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "-8000", 1, 7, 1, 12);

			diagnostics = validate("FROM node\nEXPOSE -8000\n");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "-8000", 1, 7, 1, 12);

			diagnostics = validate("FROM node\nEXPOSE -8000\n ");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "-8000", 1, 7, 1, 12);

			diagnostics = validate("FROM node\nEXPOSE 8000-");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "8000-", 1, 7, 1, 12);

			diagnostics = validate("FROM node\nEXPOSE 8000- ");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "8000-", 1, 7, 1, 12);

			diagnostics = validate("FROM node\nEXPOSE 8000-\n");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "8000-", 1, 7, 1, 12);

			diagnostics = validate("FROM node\nEXPOSE 8000-\n ");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "8000-", 1, 7, 1, 12);

			diagnostics = validate("FROM node\nEXPOSE 80\\\n00-\n");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "8000-", 1, 7, 2, 3);

			diagnostics = validate("FROM node\nEXPOSE 80\\\n00-");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "8000-", 1, 7, 2, 3);

			diagnostics = validate("FROM node\nEXPOSE -");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "-", 1, 7, 1, 8);

			diagnostics = validate("FROM node\nEXPOSE \\a");
			assert.equal(diagnostics.length, 1);
			assertInvalidPort(diagnostics[0], "a", 1, 7, 1, 9);
		});
	});

	describe("FROM", function() {
		describe("source image", function() {
			it("ok", function() {
				let diagnostics = validate("FROM node");
				assert.equal(diagnostics.length, 0);
			});
		});

		describe("build stage", function() {
			it("ok", function() {
				let diagnostics = validate("FROM node AS setup");
				assert.equal(diagnostics.length, 0);

				diagnostics = validate("FROM node As setup");
				assert.equal(diagnostics.length, 0);

				diagnostics = validate("FROM node aS setup");
				assert.equal(diagnostics.length, 0);

				diagnostics = validate("FROM node as setup");
				assert.equal(diagnostics.length, 0);

				diagnostics = validate("FROM node AS \\ \n setup");
				assert.equal(diagnostics.length, 0);
			});

			it("invalid as", function() {
				let diagnostics = validate("FROM node A$ setup");
				assert.equal(diagnostics.length, 1);
				assertInvalidAs(diagnostics[0], 0, 10, 0, 12);
			});
		});

		describe("wrong args number", function() {
			it("two", function() {
				let diagnostics = validate("FROM node AS");
				assert.equal(diagnostics.length, 1);
				assertInstructionRequiresOneOrThreeArguments(diagnostics[0], 0, 10, 0, 12);

				diagnostics = validate("FROM node As \\\n");
				assert.equal(diagnostics.length, 1);
				assertInstructionRequiresOneOrThreeArguments(diagnostics[0], 0, 10, 0, 12);

				diagnostics = validate("FROM node test");
				assert.equal(diagnostics.length, 1);
				assertInstructionRequiresOneOrThreeArguments(diagnostics[0], 0, 10, 0, 14);

				diagnostics = validate("from node test");
				assertDiagnostics(diagnostics,
					[ ValidationCode.LOWERCASE, ValidationCode.ARGUMENT_REQUIRES_ONE_OR_THREE ],
					[ assertInstructionCasing, assertInstructionRequiresOneOrThreeArguments ],
					[ [ 0, 0, 0, 4 ], [ 0, 10, 0, 14 ] ]);
			});

			it("four", function() {
				let diagnostics = validate("FROM node AS setup again");
				assert.equal(diagnostics.length, 1);
				assertInstructionRequiresOneOrThreeArguments(diagnostics[0], 0, 19, 0, 24);

				diagnostics = validate("FROM node As \\\nsetup two");
				assert.equal(diagnostics.length, 1);
				assertInstructionRequiresOneOrThreeArguments(diagnostics[0], 1, 6, 1, 9);
			});
		});
	});

	describe("MAINTAINER", function() {
		it("default", function() {
			let validator = new Validator();
			let diagnostics = validator.validate(KEYWORDS, createDocument("FROM node\nMAINTAINER author"));
			assert.equal(diagnostics.length, 1);
			assertDeprecatedMaintainer(diagnostics[0], DiagnosticSeverity.Warning, 1, 0, 1, 10);
		});

		it("ignore", function() {
			let diagnostics = validate("FROM node\nMAINTAINER author", { deprecatedMaintainer: ValidationSeverity.IGNORE });
			assert.equal(diagnostics.length, 0);
		});

		it("warning", function() {
			let diagnostics = validate("FROM node\nMAINTAINER author", { deprecatedMaintainer: ValidationSeverity.WARNING });
			assert.equal(diagnostics.length, 1);
			assertDeprecatedMaintainer(diagnostics[0], DiagnosticSeverity.Warning, 1, 0, 1, 10);
		});

		it("error", function() {
			let diagnostics = validate("FROM node\nMAINTAINER author", { deprecatedMaintainer: ValidationSeverity.ERROR });
			assert.equal(diagnostics.length, 1);
			assertDeprecatedMaintainer(diagnostics[0], DiagnosticSeverity.Error, 1, 0, 1, 10);
		});
	});
	
	describe("RUN", function() {
		it("empty newline escape", function() {
			let diagnostics = validate("FROM busybox\nRUN ls && \\\n\nls");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM busybox\rRUN ls && \\\r\rls");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM busybox\r\nRUN ls && \\\r\n\r\nls");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM busybox\r\nRUN ls && \\\r\n");
			assert.equal(diagnostics.length, 0);
		});

		it("whitespace newline escape", function() {
			let diagnostics = validate("FROM busybox\nRUN ls && \\\n \t \nls");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM busybox\rRUN ls && \\\r \t \rls");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM busybox\r\nRUN ls && \\\r\n \t \r\nls");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM busybox\r\nRUN ls && \\\r\n \t ");
			assert.equal(diagnostics.length, 0);
		});

		it("comment escape", function() {
			let diagnostics = validate("FROM busybox\nRUN ls && \\\n# comment\nls");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM busybox\rRUN ls && \\\r# comment\rls");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM busybox\r\nRUN ls && \\\r\n# comment\r\nls");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM busybox\r\nRUN ls && \\\r\n# comment");
			assert.equal(diagnostics.length, 0);
		});

		it("whitespace comment escape", function() {
			let diagnostics = validate("FROM busybox\nRUN ls && \\\n \t# comment\nls");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM busybox\rRUN ls && \\\r \t# comment\rls");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM busybox\r\nRUN ls && \\\r\n \t# comment\r\nls");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM busybox\r\nRUN ls && \\\r\n \t# comment");
			assert.equal(diagnostics.length, 0);
		});
	});

	describe("STOPSIGNAL", function() {
		it("ok", function() {
			testValidArgument("STOPSIGNAL", "9");
			testValidArgument("STOPSIGNAL", "SIGKILL");

			let diagnostics = validate("FROM busybox\nARG x\nSTOPSIGNAL $x");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM busybox\nARG x\nSTOPSIGNAL ${x}");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM busybox\nARG x\nSTOPSIGNAL s$x");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM busybox\nARG x\nSTOPSIGNAL s${x}");
			assert.equal(diagnostics.length, 0);
		});

		it("escape", function() {
			let diagnostics = validate("FROM node\nSTOPSIGNAL \\\n9");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nSTOPSIGNAL \\\n 9");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nSTOPSIGNAL\\\n 9");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nSTOPSIGNAL \\\r\n9");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nSTOPSIGNAL\\\r\n 9");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nSTOPSIGNAL \\\r\n 9");
			assert.equal(diagnostics.length, 0);

			diagnostics = validate("FROM node\nSTOPSIGNAL 9\\\n");
			assert.equal(diagnostics.length, 0);

			testEscape("STOPSIGNAL", "SI", "GKILL");
			testEscape("STOPSIGNAL", "SIGK", "ILL");
		});

		it("invalid stop signal", function() {
			let diagnostics = validate("FROM node\nSTOPSIGNAL a");
			assert.equal(diagnostics.length, 1);
			assertInvalidStopSignal(diagnostics[0], "a", 1, 11, 1, 12);

			diagnostics = validate("FROM node\nSTOPSIGNAL a ");
			assert.equal(diagnostics.length, 1);
			assertInvalidStopSignal(diagnostics[0], "a", 1, 11, 1, 12);

			diagnostics = validate("FROM node\nSTOPSIGNAL a\n");
			assert.equal(diagnostics.length, 1);
			assertInvalidStopSignal(diagnostics[0], "a", 1, 11, 1, 12);

			diagnostics = validate("FROM node\nSTOPSIGNAL a\r");
			assert.equal(diagnostics.length, 1);
			assertInvalidStopSignal(diagnostics[0], "a", 1, 11, 1, 12);
		});
	});

	describe("USER", function() {
		it("ok", function() {
			return testValidArgument("USER", "daemon");
		});

		it("escape", function() {
			return testEscape("USER", "dae", "mon");
		});
	});

	describe("VOLUME", function() {
		it("simple", function() {
			testValidArgument("VOLUME", "/var/log");
		});

		it("escape", function() {
			let diagnostics = validate("FROM node\nVOLUME /var/log \\\n /tmp");
			assert.equal(diagnostics.length, 0);
		});
	});

	describe("WORKDIR", function() {
		it("ok", function() {
			testValidArgument("WORKDIR", "/orion");
		});

		it("escape", function() {
			testEscape("WORKDIR", "/or", "ion");
		});
	});
});