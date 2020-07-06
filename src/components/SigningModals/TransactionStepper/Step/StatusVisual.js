import React, { useCallback, useState } from 'react'
import { Transition, animated } from 'react-spring'
import { css, keyframes } from 'styled-components'
import {
  GU,
  IconCheck,
  IconCross,
  springs,
  textStyle,
  useTheme,
} from '@aragon/ui'
import {
  STEP_ERROR,
  STEP_PROMPTING,
  STEP_SUCCESS,
  STEP_WAITING,
  STEP_WORKING,
} from '../stepper-statuses'

import Illustration from './Illustration'
import PropTypes from 'prop-types'

const ABSOLUTE_FILL = `
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const STATUS_ICONS = {
  [STEP_ERROR]: IconCross,
  [STEP_SUCCESS]: IconCheck,
}

const AnimatedDiv = animated.div

const spinAnimation = css`
  mask-image: linear-gradient(35deg, transparent 15%, rgba(0, 0, 0, 1));
  animation: ${keyframes`
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  `} 1.5s linear infinite;
`

const pulseAnimation = css`
  animation: ${keyframes`
    from {
      opacity: 1;
    }

    to {
      opacity: 0.2;
    }
  `} 0.75s linear alternate infinite;
`

function StatusVisual({ status, color, number, className }) {
  const theme = useTheme()
  const [firstStart, setFirstStart] = useState(true)
  const StatusIcon = STATUS_ICONS[status]

  const onStart = useCallback(() => {
    // Don’t animate on first render
    if (firstStart) {
      setFirstStart(false)
    }
  }, [firstStart])

  const renderIllustration =
    status === STEP_WORKING || status === STEP_ERROR || status === STEP_SUCCESS

  return (
    <div
      className={className}
      css={`
        position: relative;
        width: ${13.5 * GU}px;
        height: ${13.5 * GU}px;
      `}
    >
      <div
        css={`
          ${ABSOLUTE_FILL}

          display: flex;

          align-items: center;
          justify-content: center;
        `}
      >
        <div
          css={`
            position: relative;
          `}
        >
          <div
            css={`
              position: absolute;
              bottom: ${0.5 * GU}px;
              right: 0;
            `}
          >
            <Transition
              config={(_, state) =>
                state === 'enter' ? springs.smooth : springs.swift
              }
              items={StatusIcon}
              onStart={onStart}
              immediate={firstStart}
              from={{
                transform: 'scale3d(1.25, 1.25, 1)',
              }}
              enter={{
                opacity: 1,
                transform: 'scale3d(1, 1, 1)',
              }}
              leave={{
                position: 'absolute',
                opacity: 0,
                transform: 'scale3d(0.8, 0.8, 1)',
              }}
              native
            >
              {CurrentStatusIcon =>
                CurrentStatusIcon &&
                (animProps => (
                  <AnimatedDiv
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '100%',
                      padding: `${0.25 * GU}px`,
                      backgroundColor: theme.surface,
                      border: '1px solid currentColor',
                      bottom: 0,
                      right: 0,
                      color,
                      ...animProps,
                    }}
                  >
                    <CurrentStatusIcon />
                  </AnimatedDiv>
                ))
              }
            </Transition>
          </div>

          <div
            css={`
              width: ${8.5 * GU}px;
              height: ${8.5 * GU}px;
            `}
          >
            {renderIllustration ? (
              <Illustration status={status} />
            ) : (
              <div
                css={`
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: ${theme.surfaceOpened};
                  height: 100%;
                  border-radius: 100%;
                  color: ${theme.accentContent};

                  ${textStyle('title3')}
                  font-weight: 600;
                `}
              >
                {number}
              </div>
            )}
          </div>
        </div>
        <div
          css={`
            ${ABSOLUTE_FILL}
            ${status === STEP_PROMPTING && pulseAnimation}
            ${status === STEP_WORKING && spinAnimation}

            border-radius: 100%;

            border: 2px solid
            ${status === STEP_WAITING ? 'transparent' : color};
        `}
        />
      </div>
    </div>
  )
}

StatusVisual.propTypes = {
  status: PropTypes.oneOf([
    STEP_WAITING,
    STEP_PROMPTING,
    STEP_WORKING,
    STEP_SUCCESS,
    STEP_ERROR,
  ]),
  color: PropTypes.string,
  number: PropTypes.number,
  className: PropTypes.string,
}

export default StatusVisual
