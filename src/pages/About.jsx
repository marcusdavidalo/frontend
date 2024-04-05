import React from "react";
import useTitle from "../hooks/useTitle";
import Me from "../assets/home/Me.png";

const About = () => {
  useTitle("About");
  return (
    <div className="bg-gray-100 min-h-max">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">About Me</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={Me}
              alt="Marcus David Alo"
              className="w-full h-auto rounded-lg"
            />
            <p className="mt-4 text-gray-600 text-lg">
              This image was generated with my actual face run through Stable
              Diffusion Controlnet.
            </p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Marcus David Alo
            </h2>
            <div className="text-xl">
              <p className="text-gray-600 mb-4">
                I am an enthusiastic beginner web developer with a solid grasp
                of JavaScript, React, and modern web technologies. I'm
                passionate about continuously expanding my skills in web
                development. Currently, I'm self-studying AI and Python, and
                I've even cloned some language models like Ollama and TavernAI.
                I've also enjoyed cloning and using web interfaces for projects
                like "InvokeAI" and "Automatic1111", and I'm now exploring
                "OpenDevin" and "Devika" which is to my knowledge an open source
                version of Devin.ai.
              </p>
              <p className="text-gray-600 mb-4">
                I'm always eager to learn new emerging technologies relating to
                web development and AI. Discovering fresh technology excites me
                for the future. I experimented with Expo after encountering
                React Native as it was the easiest way to get started on it.
                These endeavors continuously grow my abilities and understanding
                in different tech areas.
              </p>
              <p className="text-gray-600 mb-4">
                On Kodego, I took their web development bootcamp course as I
                have always been interested in web development, but before that,
                I studied Computer Science at AMA Computer College Cebu. While
                at AMA, I left during my third year. The reason was that I felt
                like I wasn't truly learning about Computer Science and was
                simply learning what seemed more fit for IT students. Despite
                that, it was still a meaningful experience. It inspired me to
                try pursuing a more practical, self-directed educational path.
              </p>
              <p className="text-gray-600 mb-4">
                When I'm not coding or studying new tech, I dig into other
                interests. Reading up on the latest technology trends keeps me
                informed. Exploring nature rejuvenates me. And engaging with
                artificial intelligence brings me joy. These varied pursuits
                balance my driven approach to coding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
