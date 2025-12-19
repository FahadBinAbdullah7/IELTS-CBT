import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DragDropQuestionProps {
  question: string;
  options: string[];
  answer: Record<number, string>;
  onAnswerChange: (answer: Record<number, string>) => void;
}

const DragDropQuestion: React.FC<DragDropQuestionProps> = ({
  question,
  options,
  answer,
  onAnswerChange
}) => {
  const [availableOptions, setAvailableOptions] = useState<string[]>(options);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    const usedOptions = Object.values(answer || {});
    setAvailableOptions(
      options.filter(opt => !usedOptions.includes(opt))
    );
  }, [answer, options]);

  const blanks = question.split('_____');
  const blankCount = blanks.length - 1;

  const handleDragStart = (item: string, e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy';
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDropOnBlank = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem) {
      onAnswerChange({
        ...answer,
        [index]: draggedItem
      });
      setDraggedItem(null);
    }
  };

  const handleRemove = (index: number) => {
    const newAnswer = { ...answer };
    delete newAnswer[index];
    onAnswerChange(newAnswer);
  };

  const handleOptionClick = (option: string, blankIndex: number) => {
    onAnswerChange({
      ...answer,
      [blankIndex]: option
    });
  };

  const handleClearBlank = (index: number) => {
    const newAnswer = { ...answer };
    delete newAnswer[index];
    onAnswerChange(newAnswer);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <p className="text-gray-800 leading-relaxed text-lg mb-6">
          {blanks.map((part, index) => (
            <span key={index}>
              {part}
              {index < blankCount && (
                <div className="inline-block mx-1 relative">
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnBlank(index, e)}
                    className="inline-block min-w-[120px] px-3 py-2 border-2 border-dashed border-blue-400 bg-blue-50 rounded hover:bg-blue-100 transition-colors text-center"
                  >
                    {answer?.[index] ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-semibold text-blue-700">
                          {answer[index]}
                        </span>
                        <button
                          onClick={() => handleClearBlank(index)}
                          className="text-red-500 hover:text-red-700 p-0"
                          title="Remove answer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm italic">Drop here</span>
                    )}
                  </div>
                </div>
              )}
            </span>
          ))}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">
          Select options below to fill the blanks:
        </p>
        <div className="flex flex-wrap gap-2">
          {availableOptions.map((option) => (
            <div
              key={option}
              draggable
              onDragStart={(e) => handleDragStart(option, e)}
              onClick={() => {
                const firstEmptyBlank = Object.keys(answer || {})
                  .map(k => parseInt(k))
                  .filter(k => answer?.[k] !== option)
                  .length;

                if (firstEmptyBlank < blankCount) {
                  handleOptionClick(option, firstEmptyBlank);
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow font-medium select-none hover:from-blue-600 hover:to-blue-700"
              title="Drag to blank or click to fill next empty blank"
            >
              {option}
            </div>
          ))}
        </div>
        {availableOptions.length === 0 && Object.keys(answer || {}).length === blankCount && (
          <p className="text-green-600 text-sm font-medium">All blanks filled!</p>
        )}
      </div>
    </div>
  );
};

export default DragDropQuestion;
