package com.ThreeGame.ThreeGame.cv.controller;

import com.ThreeGame.ThreeGame.cv.dto.cvDto;
import com.ThreeGame.ThreeGame.cv.entity.Cv;
import com.ThreeGame.ThreeGame.cv.service.CvService;
import com.ThreeGame.ThreeGame.exeptions.exeptions.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cv")
public class CvController {
    @Autowired
    private CvService cvService;
    @PostMapping("/save")
    public Cv saveCv(@RequestBody @Validated cvDto cv, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        return cvService.saveCv(cv);
    }
    @GetMapping("/cv/all")
    public List<cvDto> findAll() {
        return cvService.findAll();
    }
}
