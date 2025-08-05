import React, { useState } from 'react';

interface Props {
  initialData: any;
  onNext: (data: any) => void;
}

const Step2ProfessionalDetails: React.FC<Props> = ({ initialData, onNext }) => {
  const [profession, setProfession] = useState(initialData.profession || '');
  const [skills, setSkills] = useState<string[]>(initialData.skills || []);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ profession, skills });
  };

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <h2 className="text-xl font-semibold">Professional Details</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Profession</label>
        <input
          type="text"
          required
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Skills</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="flex-grow border border-gray-300 rounded-md p-2"
            placeholder="Add a skill"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Add
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
            >
              <span>{skill}</span>
              <button type="button" onClick={() => handleRemoveSkill(skill)}>&times;</button>
            </span>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
      >
        Next
      </button>
    </form>
  );
};

export default Step2ProfessionalDetails;