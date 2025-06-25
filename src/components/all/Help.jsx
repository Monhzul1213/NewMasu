import React, { useState } from "react";
import { motion } from "motion/react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

import { DynamicAIIcon } from "./DynamicIcon";

export function Help(props){
  const { videoData } = props;
  const [open, setOpen] = useState(false);

  const style = {
    display: "flex",
    justifyContent: "center",
    right: 0,
    top: videoData?.length === 1 ? '40%' : videoData?.length === 2 ? '30%' : '20%',
    position:"absolute",
    zIndex: 100
  };

  const renderItem = item => {
    return (
      <div className="help_body">
        <LiteYouTubeEmbed id={item?.id} />
      </div>
    );
  }

  return (
    <div style={style}>
      {open && <motion.div
        id='table_scroll1'
        className="youtube_drawer"
        style={{ height: videoData?.length === 1 ? 200 : videoData?.length === 2 ? 350 : 500 }}
        initial={{ x: 300 }}
        animate={{ x: open ? 0 : 300 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}>
        {videoData?.map(renderItem)}
      </motion.div>}
      <motion.div
        className="youtube_drawer_toggle"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        style={{ right: open ? 300 : 0, top: videoData?.length === 1 ? 80 : videoData?.length === 2 ? 150 : 220 }}>
        <DynamicAIIcon name='AiFillYoutube' className="you_icon" style={{color: 'red'}}/>
      </motion.div>
    </div>
  );
}