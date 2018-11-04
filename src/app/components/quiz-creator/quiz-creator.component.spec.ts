/* Vendor imports */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../../modules/material.module';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
/* App imports */
import { QuizCreatorModule } from './quiz-creator.module';
import { QuizCreatorComponent as Component } from './quiz-creator.component';
import { Quiz, QuizType } from '../../types';
import { PERSONALITY_QUIZ, TRUEORFALSE_QUIZ } from '../../constants';

describe('QuizCreator Component', () => {

    let componentFixture: ComponentFixture<Component>;
    let componentDebug: DebugElement;
    let componentInstance: DebugElement['componentInstance'];
    let componentHTML: HTMLDocument;
    let DOMSelectors = {
        stepContent: '.mat-vertical-stepper-content[aria-expanded="true"]',
        nextButton: 'button[matStepperNext]',
        beforeButton: 'button[matStepperPrevious]',
        settingsForm: {
            title: 'input[matInput][formControlName="title"]',
            type: 'mat-select[formcontrolname="type"]',
            description: 'textarea[matinput][formcontrolname="description"]'
        },
        dialog: {
            textInput: 'mat-dialog-container input[matInput]'
        },
        questionForm: {
            addButton: '[formarrayname="questions"] .buttons button:first-child',
            expandAllButton: '[formarrayname="questions"] .buttons button:nth-child(2)',
            collapseAllButton: '[formarrayname="questions"] .buttons button:nth-child(3)',
            questionTextInput: '[formarrayname="questions"] .mat-expansion-panel-body > div > mat-form-field [matinput][formcontrolname="text"]',
            removeButton: '[formarrayname="questions"] mat-expansion-panel-header button:nth-child(2)',
            expandedAnswersList: '[formarrayname="questions"] mat-expansion-panel.mat-expanded .question-answer-box',
            addAnswer: '[formarrayname="questions"] mat-panel-description button:nth-child(3)',
            removeAnswer: '[formarrayname="questions"] .question-answer-box button:nth-child(3)',
            answerTextInput: '[formarrayname="questions"] .question-answer-box mat-form-field:nth-child(1) [matInput]',
            answerValueRadioInput: '[formarrayname="questions"] .question-answer-box mat-radio-group mat-radio-button input[type="radio"]',
            answerValueSelect: '[formarrayname="questions"] .question-answer-box mat-select',
            noSelectedQuizTypeWarning: '[formarrayname="questions"] .question-answer-box .notype-warning'
        },
        answerForm: {
            addButton: '[formarrayname="answers"] .buttons button:first-child',
            removeButton: '[formarrayname="answers"] mat-accordion button',
            titleInput: '[formarrayname="answers"] [formcontrolname="title"]',
            valueInput: '[formarrayname="answers"] [formcontrolname="value"]',
            answerValueSelect: '[formarrayname="answers"] mat-select',
            descriptionInput: '[formarrayname="answers"] [formcontrolname="description"]'
        }
    };
    let testUtils = {
        /**
         * Get created quiz object.
         * @returns {object}
         */
        getQuizObj: (): Quiz => componentInstance.quiz.value,
        /**
         * Go to next tab.
         */
        goNext: () => {
            (componentHTML.querySelector(DOMSelectors.nextButton) as HTMLElement).click();
            componentFixture.detectChanges();
        },
        /**
         * Go to previous tab.
         */
        goBefore: () => {
            (componentHTML.querySelector(DOMSelectors.beforeButton) as HTMLElement).click();
            componentFixture.detectChanges();
        },
        /**
         * Click on an element.
         * @param {string} selector CSS selector of element
         */
        click: (selector: string) => {
            componentDebug.query(By.css(selector)).nativeElement.click();
            componentFixture.detectChanges();
        },
        /**
         * Fill an input with provided value.
         * @param {string} inputSelector CSS selector of input
         * @param {string} value value to set
         */
        fillInput: (inputSelector: string, value: string) => {
            let input: HTMLInputElement = componentHTML.querySelector(inputSelector);
            if (!input) input = document.querySelector(inputSelector);
            if (!input) throw 'Element not found: ' + inputSelector
            input.focus();
            input.value = value;
            input.dispatchEvent(new Event('input'));
            componentFixture.detectChanges();
        },
        /**
         * Set an option of a select element.
         * @param {string} inputSelector CSS selector of select
         * @param {string} value option to set. The select element must have this option to set it.
         */
        selectOption: (inputSelector: string, value: string) => {
            let select: MatSelect = componentDebug.query(By.css(inputSelector)).componentInstance;
            select.options.find((el: MatOption) => el.value === value).select();
            componentFixture.detectChanges();
        },
        /**
         * Get a random string value or a random value from a provided range.
         * @param {Array} [values] range of values for result
         * @returns {string} a random value
         */
        getRandomValue: (values?: Array<string>): string => {
            let result: string;
            if (values && values.length) {
                result = values[ Math.floor(Math.random() * (values.length - 0)) ]
            } else {
                result = Math.random().toString();
            }
            return result;
        },
        /**
         * Add an empty question to quiz.
         */
        addQuestion: () => {
            componentDebug.query(By.css(DOMSelectors.questionForm.addButton)).nativeElement.click();
            componentFixture.detectChanges();
        },
        /**
         * Add an empty result to quiz.
         */
        addResult: () => {
            componentDebug.query(By.css(DOMSelectors.answerForm.addButton)).nativeElement.click();
            componentFixture.detectChanges();
        },
        /**
         * Remove result from quiz.
         */
        removeResult: () => {
            componentDebug.query(By.css(DOMSelectors.answerForm.removeButton)).nativeElement.click();
            componentFixture.detectChanges();
        }
    }


    beforeEach(() => {
        TestBed
            .configureTestingModule({
                imports: [ QuizCreatorModule ]
            })
            .compileComponents();
        componentFixture = TestBed.createComponent(Component);
        componentDebug = componentFixture.debugElement;
        componentInstance = componentDebug.componentInstance;
        componentHTML = componentDebug.nativeElement;
        componentFixture.detectChanges();
    })

    it('should exists', () => {
        expect(componentInstance).toBeDefined();
    })

    it('should move back and forth between sections', () => {
        // Get current tab content
        let getCurrentSectionContent = () => componentHTML.querySelector(DOMSelectors.stepContent).textContent;
        let firstSection = getCurrentSectionContent();
        testUtils.goNext();
        // Check that new tab content is different from first one
        expect(firstSection).not.toBe(getCurrentSectionContent());
        testUtils.goBefore();
        // Check that tab content is the same of first one
        expect(firstSection).toBe(getCurrentSectionContent());
    })

    it('should let add quiz settings', () => {
        // Values with which fill inputs
        let quizValues = {
            title: testUtils.getRandomValue(),
            type: testUtils.getRandomValue([PERSONALITY_QUIZ, TRUEORFALSE_QUIZ]),
            description: testUtils.getRandomValue()
        }
        testUtils.fillInput(DOMSelectors.settingsForm.title, quizValues.title);
        testUtils.fillInput(DOMSelectors.settingsForm.description, quizValues.description);
        testUtils.selectOption(DOMSelectors.settingsForm.type, quizValues.type);
        // Check that quiz object is updated
        let quizSettings = testUtils.getQuizObj().settings;
        expect(quizSettings.title).toBe(quizValues.title);
        expect(quizSettings.type).toBe(quizValues.type);
        expect(quizSettings.description).toBe(quizValues.description);
    })

    it('should have only default types of avaible quiz', () => {
        let defaultTypes: Array<QuizType> = [PERSONALITY_QUIZ, TRUEORFALSE_QUIZ];
        // Get the values of options of the select element instance
        let select: MatSelect = componentDebug.query(By.css(DOMSelectors.settingsForm.type)).componentInstance;
        let avaiblesTypes: Array<QuizType> = select.options.map((el: MatOption) => el.value);
        // Check that values of options are the default types
        avaiblesTypes.forEach(type => {
            expect(defaultTypes).toContain(type);
        });
    })

    it('should let add a new question', () => {
        let getQuestionsLength = (): number => testUtils.getQuizObj().questions.length;
        testUtils.goNext();
        // Check that quiz has 0 questions as default
        expect(getQuestionsLength()).toBe(0);
        // Add a new question and recheck
        testUtils.addQuestion();
        expect(getQuestionsLength()).toBe(1);
    })

    it('should let remove a question', () => {
        // Function to get questions length
        let getQuestionsLength = (): number => testUtils.getQuizObj().questions.length;
        // Go to questions' tab
        testUtils.goNext();
        // Add a new question and check quiz questions' length
        testUtils.addQuestion();
        expect(getQuestionsLength()).toBe(1);
        // Remove a question and recheck
        testUtils.click(DOMSelectors.questionForm.removeButton);
        expect(getQuestionsLength()).toBe(0);
    })

    it('should expand and collapse all questions', () => {
        let isPanelExpanded = () => componentHTML.querySelectorAll(DOMSelectors.questionForm.expandedAnswersList).length
        testUtils.goNext();
        testUtils.addQuestion();
        // When a question is added, its panel is collapsed as default
        expect(isPanelExpanded()).toBeFalsy();
        // Expand all questions
        testUtils.click(DOMSelectors.questionForm.expandAllButton);
        expect(isPanelExpanded()).toBeTruthy();
        // Collapse all questions
        testUtils.click(DOMSelectors.questionForm.collapseAllButton);
        expect(isPanelExpanded()).toBeFalsy();
    })

    it('should let fill questions text', () => {
        let randomValue = testUtils.getRandomValue();
        let getQuestionText = (): Quiz['questions'][0]['text'] => testUtils.getQuizObj().questions[0].text;
        testUtils.goNext();
        testUtils.addQuestion();
        // Fill input and check that quiz object has updated
        testUtils.fillInput(DOMSelectors.questionForm.questionTextInput, randomValue);
        expect(getQuestionText()).toBe(randomValue);
    })

    it('should let add a new answer to a question', () => {
        let getAnswersLength = (): number => testUtils.getQuizObj().questions[0].answers.length;
        testUtils.goNext();
        testUtils.addQuestion();
        // When question is added, it has an empty answer as default
        let defaultAnswersLength = getAnswersLength();
        expect(defaultAnswersLength).toBe(1);
        // Add a new answer to question and check that quiz object has updated
        testUtils.click(DOMSelectors.questionForm.addAnswer);
        expect(getAnswersLength()).toBe(defaultAnswersLength + 1);
    })

    it('should let remove an answer of a question', () => {
        let getAnswersLength = (): number => testUtils.getQuizObj().questions[0].answers.length;
        testUtils.goNext();
        testUtils.addQuestion();
        // When question is added, it has an empty answer as default
        let defaultAnswersLength = getAnswersLength();
        expect(defaultAnswersLength).toBe(1);
        // Add a new answer to question and check that quiz object has updated
        testUtils.click(DOMSelectors.questionForm.removeAnswer);
        expect(getAnswersLength()).toBe(defaultAnswersLength - 1);
    })

    it('should have a warning message if no quiz type is selected', () => {
        testUtils.goNext();
        testUtils.addQuestion();
        expect(
            componentHTML.querySelector(DOMSelectors.questionForm.noSelectedQuizTypeWarning)
        ).toBeTruthy();
    })

    it('should set right answer\'s options for the \'True or False\' type', () => {
        // Set type of quiz
        testUtils.selectOption(DOMSelectors.settingsForm.type, TRUEORFALSE_QUIZ);
        testUtils.goNext();
        testUtils.addQuestion();
        // Check that there are two radio buttons
        let radioButtons = componentHTML.querySelectorAll(DOMSelectors.questionForm.answerValueRadioInput);
        expect(radioButtons.length).toBe(2);
        // Select one of two options
        (radioButtons[0] as HTMLInputElement).click();
        componentFixture.detectChanges();
        // Check value of answer in the quiz, in this case it should be "true"
        expect(
            testUtils.getQuizObj().questions[0].answers[0].value
        ).toBe(true)

    })

    it('should set right answer\'s input for the \'Personality\' type', async () => {
        // Set type of quiz
        testUtils.selectOption(DOMSelectors.settingsForm.type, PERSONALITY_QUIZ);
        testUtils.goNext();
        testUtils.addQuestion();
        testUtils.click(DOMSelectors.questionForm.expandAllButton);
        // Trigger modal opening and waiting for it
        let selectDebugElement = componentDebug.query(By.css(DOMSelectors.questionForm.answerValueSelect));
        selectDebugElement.componentInstance.options.last._element.nativeElement.click();
        await componentFixture.whenRenderingDone();
        // Enter answer's value in modal and check quiz object
        let randomValue = testUtils.getRandomValue();
        testUtils.fillInput(DOMSelectors.dialog.textInput, randomValue);
        expect(
            testUtils.getQuizObj().questions[0].answers[0].value
        ).toBe(randomValue);
        // After test remove modal input to avoid conflicts with other tests that use it
        document.querySelector(DOMSelectors.dialog.textInput).remove();
    })

    it('should let fill text of a question\'s answer', () => {
        let randomValue = testUtils.getRandomValue();
        let getAnswerText = (): Quiz['questions'][0]['answers'][0]['text'] => testUtils.getQuizObj().questions[0].answers[0].text;
        testUtils.goNext();
        testUtils.addQuestion();
        // Fill question and check that quiz object has updated
        testUtils.fillInput(DOMSelectors.questionForm.answerTextInput, randomValue);
        expect(getAnswerText()).toBe(randomValue);
    })

    it('should let add a new result to quiz', () => {
        let getResultsLength = (): number => testUtils.getQuizObj().answers.length;
        testUtils.goNext();
        testUtils.goNext();
        // Check current results length
        let defaultResultsLength = getResultsLength();
        expect(defaultResultsLength).toBe(0);
        // Add a new result and check that quiz object has updated
        testUtils.addResult();
        expect(getResultsLength()).toBe(defaultResultsLength + 1);
    })

    it('should let remove a result of quiz', () => {
        let getResultsLength = (): number => testUtils.getQuizObj().answers.length;
        testUtils.goNext();
        testUtils.goNext();
        testUtils.addResult();
        // Check current results length
        let defaultResultsLength = getResultsLength();
        expect(defaultResultsLength).toBe(1);
        // Remove a result and check that quiz object has updated
        testUtils.removeResult();
        expect(getResultsLength()).toBe(defaultResultsLength - 1);
    })

    it('should let fill a result for a \'True or False\' quiz', () => {
        // Values with which fill inputs
        let quizValues = {
            title: testUtils.getRandomValue(),
            value: testUtils.getRandomValue(),
            description: testUtils.getRandomValue()
        }
        testUtils.selectOption(DOMSelectors.settingsForm.type, TRUEORFALSE_QUIZ);
        testUtils.goNext();
        testUtils.goNext();
        testUtils.addResult();
        // Fill inputs and check that quiz object has updated
        testUtils.fillInput(DOMSelectors.answerForm.titleInput, quizValues.title);
        testUtils.fillInput(DOMSelectors.answerForm.valueInput, quizValues.value);
        testUtils.fillInput(DOMSelectors.answerForm.descriptionInput, quizValues.description);
        expect(testUtils.getQuizObj().answers[0].title).toBe(quizValues.title);
        expect(testUtils.getQuizObj().answers[0].value).toBe(quizValues.value);
        expect(testUtils.getQuizObj().answers[0].description).toBe(quizValues.description);
    })

    it('should let fill a result for a \'Personality\' quiz', async () => {
        // Values with which fill inputs
        let quizValues = {
            title: testUtils.getRandomValue(),
            value: testUtils.getRandomValue(),
            description: testUtils.getRandomValue()
        }
        testUtils.selectOption(DOMSelectors.settingsForm.type, PERSONALITY_QUIZ);
        testUtils.goNext();
        testUtils.goNext();
        testUtils.addResult();
        // Fill inputs
        testUtils.fillInput(DOMSelectors.answerForm.titleInput, quizValues.title);
        testUtils.fillInput(DOMSelectors.answerForm.descriptionInput, quizValues.description);
        // Trigger modal opening and waiting for it
        let selectDebugElement = componentDebug.query(By.css(DOMSelectors.answerForm.answerValueSelect));
        selectDebugElement.componentInstance.options.last._element.nativeElement.click();
        await componentFixture.whenRenderingDone();
        // Enter result's value in the modal
        testUtils.fillInput(DOMSelectors.dialog.textInput, quizValues.value);
        // Check the quiz object
        expect(testUtils.getQuizObj().answers[0].title).toBe(quizValues.title);
        expect(testUtils.getQuizObj().answers[0].value).toBe(quizValues.value);
        expect(testUtils.getQuizObj().answers[0].description).toBe(quizValues.description);
        // After test remove modal input to avoid conflicts with other tests that use it
        document.querySelector(DOMSelectors.dialog.textInput).remove();
    })
})