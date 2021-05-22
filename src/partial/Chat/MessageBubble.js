import { useRef, useState } from 'react'
import useOnClickOutside from '../../hooks/useOnClickOutside';
import styles from './MessageBubble.module.css'


export default function MessageBubble({messageId, chat, setShowBubble, side}) {
    const ref = useRef()
    const [spanDirection, setSpanDirection] = useState(side === 'left' ? styles.left : styles.right)

    useOnClickOutside(ref, () => {
        setSpanDirection(side === 'left' ? `${styles.outLeft} ${styles.left}` : `${styles.outRight} ${styles.right}`)
        setTimeout(() => {
            setShowBubble(false)
        }, 200)
    })

    function deleteMessage() {
        //message can to be deleted only if the message id is returned from the backend in websocket
        if(messageId) {
            chat.emit('message', {
                id: messageId,
                action: 'delete'
            });
        }
    }


    return (
        <span ref={ref} className={`${styles.container} ${spanDirection}`}>
            <i onClick={deleteMessage} className="fas fa-trash-alt"></i>
        </span>
    )
}
