let pauseButton = document.querySelector('#pause')
let playButton = document.querySelector('#play')
let video = document.getElementById('.video')

function pauseClick() {
  pauseButton.classList.toggle('hidepause')
}

pauseButton.addEventListener('click', pauseClick)

var volumeKnob = document.getElementById('volume-knob')
var volumeBar = document.getElementById('volume-bar')

// States
var isDragging = false
let globalVolume = 0

volumeKnob.addEventListener('mousedown', function (e) {
  isDragging = true
  document.addEventListener('mousemove', moveKnob)
  document.addEventListener('mouseup', stopDragging)
})

function calVolume(knobPosition, barWidth) {
  return knobPosition / barWidth
}

function moveKnob(e) {
  if (!isDragging) return

  var barRect = volumeBar.getBoundingClientRect()
  var minX = barRect.left
  var maxX = barRect.right - volumeKnob.offsetWidth // Adjusted to keep the knob fully inside the bar

  var xPos = e.clientX
  // Constrain knob position within the volume bar bounds
  xPos = Math.max(minX, Math.min(xPos, maxX))

  var knobPosition = xPos - barRect.left
  volumeKnob.style.left = knobPosition + 'px' // Update knob position
  // Adjust volume level here based on knob position

  const audios = document.querySelectorAll('audio')

  globalVolume = calVolume(knobPosition, barRect.width)

  audios.forEach((elm) => {
    elm.volume = globalVolume
  })
}

function stopDragging() {
  isDragging = false
}

document.addEventListener('DOMContentLoaded', function () {
  const draggables = document.querySelectorAll('.dragbox')
  const dropzones = document.querySelectorAll(
    '.addbox1, .addbox2, .addbox3, .addbox4'
  )

  let draggedItem = null

  function dragStart(e) {
    draggedItem = this
    this.classList.add('dragging')
    e.dataTransfer.setData('text/plain', '')
  }

  function dragEnd() {
    this.classList.remove('dragging')
  }

  function dragOver(e) {
    e.preventDefault()
  }

  function dragEnter(e) {
    e.preventDefault()
    this.classList.add('hovered')
  }

  function dragLeave() {
    this.classList.remove('hovered')
  }

  function dragDrop() {
    this.classList.remove('hovered')
    this.innerHTML = '' // Clear previous content

    // Clone the dragged item
    const draggedSvg = draggedItem.querySelector('.card-svg').cloneNode(true)

    // Add the cloned SVG to the drop zone
    this.appendChild(draggedSvg)

    // Center the cloned SVG
    draggedSvg.style.position = 'absolute'
    draggedSvg.style.top = '50%'
    draggedSvg.style.left = '50%'
    draggedSvg.style.transform = 'translate(-50%, -50%)'

    // Remove margin from the cloned SVG
    draggedSvg.style.margin = '0'

    // Get the audio element corresponding to the dropped instrument
    const audio = draggedItem.querySelector('audio')

    // Get the video element
    const video = document.querySelector('.video')

    // Play or pause the audio based on its current state
    if (audio) {
      if (audio.paused) {
        audio.volume = globalVolume
        audio.dataset.inLoop = true
        const audios = document.querySelectorAll('audio')
        audios.forEach(elm => elm.dataset.inLoop ? elm.play() : false)
        video.play()
        playButton.classList.add('hidepause')
        pauseButton.classList.remove('hidepause')
      } else {
        audio.pause()
        video.pause()
        playButton.classList.remove('hidepause')
        pauseButton.classList.add('hidepause')
      }
    }
  }

  draggables.forEach((draggable) => {
    draggable.addEventListener('dragstart', dragStart)
    draggable.addEventListener('dragend', dragEnd)
  })

  dropzones.forEach((dropzone) => {
    dropzone.addEventListener('dragover', dragOver)
    dropzone.addEventListener('dragenter', dragEnter)
    dropzone.addEventListener('dragleave', dragLeave)
    dropzone.addEventListener('drop', dragDrop)
  })

  let pauseButton = document.querySelector('#pause')
  let playButton = document.querySelector('#play')

  function pauseClick() {
    pauseButton.classList.add('hidepause')
    playButton.classList.remove('hidepause')

    const video = document.querySelector('.video')
    video.pause()
    
    const audios = document.querySelectorAll('audio')
    audios.forEach(elm => {
        elm.pause()
    })
  }

  function playClick() {
    playButton.classList.add('hidepause')
    pauseButton.classList.remove('hidepause')

    const video = document.querySelector('.video')
    video.play()
    
    const audios = document.querySelectorAll('audio')
    audios.forEach(elm => {
        if (!elm.dataset.inLoop) return
        elm.play()
    })
  }

  pauseButton.addEventListener('click', pauseClick)
  playButton.addEventListener('click', playClick)
})