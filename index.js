/**
 * @fileoverview test rule
 * @author Roman
 */
"use strict";
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const _ = require("lodash");

module.exports.rules = {
    "checkFindArgument": context => ({
        // variables should be defined here

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------
        "MemberExpression": function (node) {
            let functionName = node.property.name;
            if ((functionName == 'find') || (functionName == 'findOne')) {
                let flag = false;
                if (typeof (node.parent.callee) == "undefined") {
                    flag = false;
                }
                else {
                    if (node.parent.callee.object.name === '_') {
                    flag = true;
                     }
                    const args = node.parent.arguments;
                    if (args == 0) {
                        flag = true;
                    }
                    if (args && args.length) {
                        _.forEach(args, function (element) {
                            if (element.type === 'ArrowFunctionExpression') {
                                flag = true;
                            }
                            if (element.properties) {
                                if (
                                    element.properties.find(v => v.key.name === 'where') ||
                                    element.properties.find(v => v.key.name === 'include') ||
                                    element.properties.find(v => v.key.name === 'fields') ||
                                    element.properties.find(v => v.key.value === 'fields') ||
                                    element.properties.find(v => v.key.value === 'where') ||
                                    element.properties.find(v => v.key.value === 'order')
                                ) {
                                    flag = true;
                                }
                            }
                        });
                    }
                }
                if (!flag) {
                    context.report(node.property, 'Wrong argument for function find/findOne');
                }
            }

        }
    }),
    "checkdestroyAllArgumentNull": context => ({

        "MemberExpression": function (node) {
            let functionName = node.property.name;
            if (functionName == 'destroyAll') {

                const args = node.parent.arguments;
                if (args == 0) {
                    context.report(node.property, 'Null argument for function destroyAll');
                }
            }
        }
    }),
    "checkdestroyAllArgumentWhere": context => ({
        "MemberExpression": function (node) {
            let functionName = node.property.name;
            if (functionName == 'destroyAll') {
                const args = node.parent.arguments;
                if (args && args.length) {
                    _.forEach(args, function (element) {
                        if (element.type === 'ArrowFunctionExpression') {
                            flag = true;
                        }
                        if (element.properties) {
                            if (
                                element.properties.find(v => v.key.name === 'where') ||
                                element.properties.find(v => v.key.value === 'where')
                            ) {
                                context.report(node.property, 'Where argument for function destroyAll');
                            }
                        }
                    });
                }
            }
        }
    })
};
