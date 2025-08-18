export type Question = {
	question: string;
	answers: Array<{ id: number; label: string; answer: string }>;
	name: string;
};

export const questions: Question[] = [
	{
		name: 'questionOne',
		question: 'How much time do you want to spend on a new hobby per/week?',
		answers: [
			{ id: 1, label: '<= 1hr', answer: 'less than 1 hour' },
			{ id: 2, label: '<= 4hrs', answer: 'less than 4 hours' },
			{ id: 3, label: '<= 8hrs', answer: 'less than 8 hours' },
			{ id: 4, label: 'All I got is time baby', answer: 'All the time in the world' }
		]
	},
	{
		name: 'questionTwo',
		question: 'What kind of environment do you live in?',
		answers: [
			{ id: 5, label: 'Rural', answer: 'lives in rural environment' },
			{ id: 6, label: 'Suburbs', answer: 'lives in the suburbs' },
			{ id: 7, label: 'City', answer: 'lives in the city' },
			{ id: 8, label: 'Beach', answer: 'lives in a beach area' }
		]
	},
	{
		name: 'questionThree',
		question: 'How would you best describe your personality?',
		answers: [
			{
				id: 9,
				label: 'Introverted',
				answer: 'introverted personality'
			},
			{
				id: 10,
				label: 'Extroverted',
				answer: 'extroverted personality'
			},
			{
				id: 11,
				label: 'Introverted but trying to branch out',
				answer: 'introverted but trying to become more extroverted'
			},
			{
				id: 12,
				label: 'Extroverted but should relax a little bit',
				answer: 'extroverted but wants to learn to do some things alone'
			}
		]
	},
	{
		name: 'questionFour',
		question: 'How much money would you prefer to spend on this new hobby?',
		answers: [
			{
				id: 13,
				label: '$0',
				answer: 'no money'
			},
			{
				id: 14,
				label: 'I can spare a few bucks',
				answer: 'not much, if at all'
			},
			{
				id: 15,
				label: 'A modest amount',
				answer: 'can spend a good chunk of change'
			},
			{
				id: 16,
				label: 'As much as I need to',
				answer: 'can be an expensive hobby'
			}
		]
	}
];
