import pandas
import json
from collections import defaultdict
from random import randint
# Final output
output = defaultdict()



questions = pandas.read_csv("./Questions_data_prj3.csv")

for index, row in questions.iterrows():
	newQuestion = defaultdict()
	newQuestion['question'] = row['Question_text']
	newQuestion['a'] = row['Choice_A_text']
	newQuestion['b'] = row['Choice_B_text']
	newQuestion['c'] = row['Choice_C_text']
	newQuestion['d'] = row['Choice_D_text']
	newQuestion['correct'] = row['Correct_answer_choice']
	output[str(index+1) + "_original"] = newQuestion
	output[str(index+1) + "_retake"] = defaultdict()



answers = pandas.read_csv("./Answers_data_prj3_updated.csv").sort_values(by=['Student_score_on_question', 'Quiz_score', 'Average_quizzes_score'], ascending=[False, False, False])
answerGroups = answers.groupby('Question_id')



# Creates a lists of lists
	# Outer layer has one entry per question
	# The inner layer (per question) has two answers (at the beginning) that are correct, and one wrong answer per wrong answer selected on the quiz
	# If there are fewer than 3 different wrong answers that were selected, include additional wrong responses from the last group of wrong answers
		#i.e. if everyone who got the question wrong chose the same wrong answer, include 3 responses from people who chose that wrong answer
res = [[] for group in answerGroups]
for index, group in answerGroups:
	#Select top two answers
	best_answers = group.head(2)['Answer_text']
	feedback = best_answers.iloc[0] #used best response as feedback
	correct_answer_for_retake = best_answers.iloc[1] #use second best answer as correct answer for retake


	res[index-1].append(feedback)
	res[index-1].append(correct_answer_for_retake)


	# For every wrong answer given, add a response to the answers
	wrong = group.loc[group.Student_score_on_question < 1].groupby('Student_choice_on_question')
	countOfDifferentWrongAnswers = len(wrong) #used to detect if we need multiple responses from this wrong answer group
	wrongAnswerIndex = 1
	for name, wrong_group in wrong:
		res[index-1].append(wrong_group.head(1)['Answer_text'].iloc[0]) #grab first wrong answer from this group
		# Check if there aren't enough groups of wrong answers (i.e. < 3 different wrong answers chosen by students)
		if countOfDifferentWrongAnswers < 3 and wrongAnswerIndex == countOfDifferentWrongAnswers:
			# If not enough distinct wrong answers, take extra wrong free responses from last group of wrong answers
			for answerIndex, answerRow in wrong_group.iloc[1:].iterrows():
				res[index-1].append(answerRow['Answer_text'])
		wrongAnswerIndex += 1



# Create retake question from previous answers
for index, answerList in enumerate(res):
	optionNames = ['A', 'B', 'C', 'D']
	# Set feedback as best answer given
	feedback = answerList.pop(0)
	output[str(index+1) + "_original"]['feedback'] = feedback #Original and retake get same feedback
	output[str(index+1) + "_retake"]['feedback'] = feedback
	# Select correct option for retake as second best answer given
	correctAnswerName = optionNames.pop(randint(0, len(answerList)-1))
	output[str(index+1) + "_retake"][correctAnswerName] = answerList.pop(0) #Choose random optionName (a, b, c, c) for correct answer
	output[str(index+1) + "_retake"]["correct"] = correctAnswerName
	for answerIndex, answerName in enumerate(optionNames):
		# If there were not enough wrong answers, use only the correct answer and however many wrong anwers there are
		if len(res[index]) > answerIndex:
			output[str(index+1) + "_retake"][answerName] = res[index][answerIndex]

# Save result as json on disk
with open("./output.json", 'w') as f:
	json.dump(output, f)