import React from 'react';
import IconCopy from '../assets/images/icon-copy.svg'
import Clipboard from 'clipboard'
import $ from "jquery"

new Clipboard(".copy")

const ButtonCopy = props => {

    const { copyText,copyIcon } = props

    const onClickCopy = (e) => {
        const btn = $(e.target).parent()
        btn.addClass('copied')
        setTimeout(() => {
            btn.removeClass('copied')
        },1500)
    }

    return (
        <div className="copy" data-clipboard-text={copyText}>
            <img alt="photos" src={!copyIcon ? IconCopy: copyIcon} onClick={onClickCopy}></img>
        </div>
    );
};

export default ButtonCopy;