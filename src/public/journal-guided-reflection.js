const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export function getGuidedReflectionQuestionNumber(index) {
  return ROMAN_NUMERALS[index] || `${index + 1}`;
}

export function parseGuidedReflectionText(value) {
  const text = String(value || '').replace(/\r\n?/g, '\n');
  const headingPattern = /(Guided Reflection|Shadow Reflection)/gi;
  let headingMatch = headingPattern.exec(text);

  while (headingMatch) {
    const guidedText = text.slice(headingPattern.lastIndex);
    const markerPattern = /(?:^|\s)(I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s*/g;
    const markers = Array.from(guidedText.matchAll(markerPattern));

    if (markers.length) {
      const items = markers.map((marker, index) => {
        const markerEnd = Number(marker.index) + marker[0].length;
        const nextMarkerStart = index + 1 < markers.length
          ? Number(markers[index + 1].index)
          : guidedText.length;
        const block = guidedText.slice(markerEnd, nextMarkerStart).trim();
        const answerMatch = /Answer:\s*/i.exec(block);

        if (!answerMatch) {
          return null;
        }

        return {
          numeral: marker[1],
          question: block.slice(0, answerMatch.index).trim(),
          answer: block.slice(answerMatch.index + answerMatch[0].length).trim(),
        };
      });

      if (items.every((item) => item && item.question)) {
        return {
          heading: headingMatch[1],
          body: text.slice(0, headingMatch.index).trim(),
          items,
        };
      }
    }

    headingMatch = headingPattern.exec(text);
  }

  return null;
}

export function renderGuidedReflection(container, { heading = 'Guided Reflection', items = [] } = {}) {
  if (!container || !Array.isArray(items) || !items.length) {
    return null;
  }

  const wrapper = document.createElement('div');
  const title = document.createElement('h4');

  wrapper.className = 'journal-entry-view__guided journal-guided-reflection';
  title.textContent = heading;
  wrapper.append(title);

  items.forEach((item, index) => {
    const section = document.createElement('div');
    const question = document.createElement('p');
    const answer = document.createElement('p');
    const answerLabel = document.createElement('strong');
    const answerText = document.createElement('span');

    section.className = 'journal-guided-reflection__item';
    question.className = 'journal-guided-reflection__question';
    answer.className = 'journal-guided-reflection__answer';
    question.textContent = `${item.numeral || getGuidedReflectionQuestionNumber(index)}. ${item.question || 'Guided answer'}`;
    answerLabel.textContent = 'Answer:';
    answerText.textContent = item.answer || '';
    answer.append(answerLabel, document.createTextNode(' '), answerText);
    section.append(question, answer);
    wrapper.append(section);
  });

  container.append(wrapper);
  return wrapper;
}
