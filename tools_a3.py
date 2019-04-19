import pandas

answers = pandas.read_csv("./Answers_data_prj3_updated.csv").sort_values(by=['Student_score_on_question', 'Quiz_score', 'Average_quizzes_score'], ascending=[False, False, False])
answerGroups = answers.groupby('Question_id')



res = [[] for group in answerGroups]

for index, group in answerGroups:
	#Select top two answers
	best_answers = group.head(2)['Answer_text']
	feedback = best_answers.iloc[0] #used best response as feedback
	correct_answer_for_retake = best_answers.iloc[1] #use second best answer as correct answer for retake

	res[index-1].append(feedback)
	res[index-1].append(correct_answer_for_retake)


	# For every wrong answer given, add a response to the answers
	wrong = group.loc[group.Student_score_on_question < 1].groupby('Student_score_on_question')
	for name, wrong_group in wrong:
		# print(name, wrong_group)
		res[index-1].append(wrong_group.head(1)['Answer_text'].iloc[0])

# Creates a lists of lists
	# Outer layer has one entry per question
	# The inner layer (per question) has two answers (at the beginning) that are wrong, and one wrong answer per wrong answer selected on the quiz
print(res)