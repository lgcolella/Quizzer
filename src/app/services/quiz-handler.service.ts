import { Injectable } from '@angular/core';
import { Quiz, Result, AnswerValue } from '../interfaces/quiz';
import { PERSONALITY_QUIZ, TRUEORFALSE_QUIZ } from '../interfaces/quizTypes';

@Injectable()
export class QuizHandler {

    private currentQuiz : Quiz;
    private currentQuestionIndex: number;
    private answers = [];

    constructor(){
    }

    load(quiz: Quiz) : this {
        this.currentQuiz = quiz;
        return this;
    }

    getQuizObject() : Quiz {
        return Object.assign({}, this.currentQuiz);
    }

    getResult(answers : AnswerValue[]) : Result {
        
        //Results matching with provided answers
        let answerObjs;

        //Get result according to quiz type
        switch (this.currentQuiz.settings.type){

            case (PERSONALITY_QUIZ) :
                //Create an object where store answers' value with its frequency
                let answersWithFrequency = {};
                //Iterate on answers' array to populate answersWithFrequency
                answers.forEach((value) => {
                    if (typeof value !== 'string') throw `Valore di ${value} non valido.`;
                    
                    if( answersWithFrequency.hasOwnProperty(value)){
                        answersWithFrequency[value] += 1;
                    } else {
                        answersWithFrequency[value] = 1;
                    }
                });
                //Find answer with higher frequency
                let answerWithHigherFrequency;
                for (let value in answersWithFrequency){
                    if(answersWithFrequency.hasOwnProperty(value)){
                        let storedValue = answersWithFrequency[answerWithHigherFrequency];
                        let currentValue = answersWithFrequency[value];
                        let cond = typeof storedValue !== 'undefined' && storedValue > currentValue;
                        answerWithHigherFrequency = (cond ? answerWithHigherFrequency : value);
                    }
                }
                //Return result object matching with answerWithHigherFrequency
                answerObjs = this.currentQuiz.results.filter((obj) => {
                    return obj.value.toString().trim().toLowerCase() === answerWithHigherFrequency.trim().toLowerCase();
                });
            break;
            case (TRUEORFALSE_QUIZ) :
                //Get number of correct answers
                let correctAnswers = 0;
                for (let i = 0; i < answers.length; i++){
                    if (answers[i]) correctAnswers++
                }
                //Filter answer objects matching with number of correct answers
                answerObjs = this.currentQuiz.results.filter((answerObj) => {
                    let answerValue = answerObj.value;
                    let rangeSeparator = '-'; //If answerValue is a range then it has this separator
                    //Detect if answerValue is a single number or a range
                    if (answerValue.indexOf(rangeSeparator) !== -1){
                        //Get numerical values of the range
                        let maxValue = Math.max( ...answerValue.split(rangeSeparator).map(Number) );
                        let minValue = Math.min( ...answerValue.split(rangeSeparator).map(Number) );
                        //Return if correctAnswers matches with provided range
                        return minValue <= correctAnswers && correctAnswers <= maxValue;
                    } else {
                        //Return if correctAnswers matches with answerObj value
                        return correctAnswers === Number(answerValue); 
                    }
                })
            break;

        }


        //Return first right result
        return answerObjs[0];

    }

}