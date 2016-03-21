filterBank = [
    {
        name: "Applied",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "application.state"
            },
            {
                type: "number",
                value: 0
            }
        ]
    },
    {
        name: "Contacted",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "application.state"
            },
            {
                type: "number",
                value: 1
            }
        ]
    },
    {
        name: "Hired",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "application.state"
            },
            {
                type: "number",
                value: 2
            }
        ]
    },
    {
        name: "Declined",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "application.state"
            },
            {
                type: "number",
                value: 3
            }
        ]
    },
    {
        name: "Great Fit",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: ">",
        operands: [
            {
                type: "attr",
                value: "careerMatchScore.overall"
            },
            {
                type: "number",
                value: 60
            }
        ]
    },
    {
        name: "Weekdays",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        note: "filter by having > 10 hours of weekday work",
        operator: ">",
        operands: [
            {
                type: "computation",
                operator: "+",
                operands: [
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "attr",
                                value: "user.availability.mon"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "attr",
                                value: "user.availability.tue"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "attr",
                                value: "user.availability.wed"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "attr",
                                value: "user.availability.thu"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "attr",
                                value: "user.availability.fri"
                            }

                        ]
                    }
                ]
            },
            {
                type: "number",
                value: 10
            }
        ]
    },
    {
        name: "Weekend",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        note: "filter by having > 10 hours of weekend day work",
        operator: ">",
        operands: [
            {
                type: "computation",
                operator: "+",
                operands: [
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "attr",
                                value: "user.availability.sat"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "attr",
                                value: "user.availability.sun"
                            }

                        ]
                    }
                ]
            },
            {
                type: "number",
                value: 10
            }
        ]
    },
    {
        name: "Mornings",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        note: "filter by having > 10 hours of morning work 0 to 10",
        operator: ">",
        operands: [
            {
                type: "computation",
                operator: "+",
                operands: [
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    stop: 10
                                },
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.mon"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    stop: 10
                                },
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.tue"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    stop: 10
                                },
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.wed"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    stop: 10
                                },
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.thu"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    stop: 10
                                },
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.fri"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    stop: 10
                                },
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.sat"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    stop: 10
                                },
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.sun"
                                    }

                                ]
                            }

                        ]
                    }
                ]
            },
            {
                type: "number",
                value: 10
            }
        ]
    },
    {
        name: "Days",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        note: "filter by having > 10 hours of work between 10 and 18",
        operator: ">",
        operands: [
            {
                type: "computation",
                operator: "+",
                operands: [
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    start: 10,
                                    stop: 18
                                },
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.mon"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    start: 10,
                                    stop: 18
                                },
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.tue"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    start: 10,
                                    stop: 18
                                },
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.wed"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    start: 10,
                                    stop: 18
                                },
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.thu"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    start: 10,
                                    stop: 18
                                },
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.fri"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    start: 10,
                                    stop: 18
                                },
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.sat"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    start: 10,
                                    stop: 18
                                },
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.sun"
                                    }

                                ]
                            }

                        ]
                    }
                ]
            },
            {
                type: "number",
                value: 10
            }
        ]
    },
    {
        name: "Nights",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        note: "filter by having > 10 hours of night work between 14 and 24",
        operator: ">",
        operands: [
            {
                type: "computation",
                operator: "+",
                operands: [
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    start: 14
                                }
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.mon"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    start: 14
                                }
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.tue"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    start: 14
                                }
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.wed"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    start: 14
                                }
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.thu"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    start: 14
                                }
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.fri"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    start: 14
                                }
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.sat"
                                    }

                                ]
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "len",
                        operands: [
                            {
                                type: "computation",
                                operator: "slice",
                                options: {
                                    start: 14
                                }
                                operands: [
                                    {
                                        type: "attr",
                                        value: "user.availability.sun"
                                    }

                                ]
                            }

                        ]
                    }
                ]
            },
            {
                type: "number",
                value: 10
            }
        ]
    },
    {
        name: "Winter",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "user.availability.season"
            },
            {
                type: "string",
                value: "winter"
            }
        ]
    },
    {
        name: "Spring",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "user.availability.season"
            },
            {
                type: "string",
                value: "spring"
            }
        ]
    },
    {
        name: "Summer",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "user.availability.season"
            },
            {
                type: "string",
                value: "summer"
            }
        ]
    },
    {
        name: "Fall",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "user.availability.season"
            },
            {
                type: "string",
                value: "fall"
            }
        ]
    },
    {
        name: "High School",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: ">=",
        operands: [
            {
                type: "computation",
                operator: "indexOf",
                operands: [
                    {
                        type: "array",
                        value: ["High School", "Certificate", "Associate's Degree", "Bachelor's Degree", "Master's Degree", "Professional Degree", "Doctoral Degree", "Post-Doctoral Training"]
                    },
                    {
                        type: "attr",
                        value: "user.educationMax.programType"
                    }
                ]
            },
            {
                type: "number",
                value: 0
            }
        ]
    },
    {
        name: "Certificate",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: ">=",
        operands: [
            {
                type: "computation",
                operator: "indexOf",
                operands: [
                    {
                        type: "array",
                        value: ["High School", "Certificate", "Associate's Degree", "Bachelor's Degree", "Master's Degree", "Professional Degree", "Doctoral Degree", "Post-Doctoral Training"]
                    },
                    {
                        type: "attr",
                        value: "user.educationMax.programType"
                    }
                ]
            },
            {
                type: "number",
                value: 1
            }
        ]
    },
    {
        name: "College",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: ">=",
        operands: [
            {
                type: "computation",
                operator: "indexOf",
                operands: [
                    {
                        type: "array",
                        value: ["High School", "Certificate", "Associate's Degree", "Bachelor's Degree", "Master's Degree", "Professional Degree", "Doctoral Degree", "Post-Doctoral Training"]
                    },
                    {
                        type: "attr",
                        value: "user.educationMax.programType"
                    }
                ]
            },
            {
                type: "number",
                value: 2
            }
        ]
    },
    {
        name: "Attending",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "user.educationStatus"
            },
            {
                type: "string",
                value: "attending"
            }
        ]
    },
    {
        name: "Likes Job Security",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "<",
        operands: [
            {
                type: "attr",
                value: "user.tenureAvg"
            },
            {
                type: "number",
                value: 12
            }
        ]
    },

]